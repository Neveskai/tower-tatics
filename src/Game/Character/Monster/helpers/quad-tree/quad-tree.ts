export interface Point {
  x: number;
  y: number;
  data: unknown;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Quadtree {
  private boundary: Rect;
  private capacity: number;
  private points: Point[] = [];
  private divided = false;
  private northeast?: Quadtree;
  private northwest?: Quadtree;
  private southeast?: Quadtree;
  private southwest?: Quadtree;

  constructor(boundary: Rect, capacity = 4) {
    this.boundary = boundary;
    this.capacity = capacity;
  }

  insert(point: Point): boolean {
    if (!this.contains(this.boundary, point)) return false;

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) this.subdivide();

    return (
      this.northeast!.insert(point) ||
      this.northwest!.insert(point) ||
      this.southeast!.insert(point) ||
      this.southwest!.insert(point)
    );
  }

  private subdivide() {
    const { x, y, width, height } = this.boundary;
    const hw = width / 2;
    const hh = height / 2;

    this.northeast = new Quadtree({ x: x + hw, y, width: hw, height: hh }, this.capacity);
    this.northwest = new Quadtree({ x, y, width: hw, height: hh }, this.capacity);
    this.southeast = new Quadtree({ x: x + hw, y: y + hh, width: hw, height: hh }, this.capacity);
    this.southwest = new Quadtree({ x, y: y + hh, width: hw, height: hh }, this.capacity);

    this.divided = true;
  }

  query(range: Rect, found: Point[] = []) {
    if (!this.intersects(this.boundary, range)) return found;

    for (const p of this.points) {
      if (this.contains(range, p)) found.push(p);
    }

    if (this.divided) {
      this.northeast!.query(range, found);
      this.northwest!.query(range, found);
      this.southeast!.query(range, found);
      this.southwest!.query(range, found);
    }

    return found;
  }

  clear() {
    this.points = [];
    this.divided = false;
    this.northeast = undefined;
    this.northwest = undefined;
    this.southeast = undefined;
    this.southwest = undefined;
  }

  private contains(rect: Rect, point: Point): boolean {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }

  private intersects(a: Rect, b: Rect): boolean {
    return !(
      b.x > a.x + a.width ||
      b.x + b.width < a.x ||
      b.y > a.y + a.height ||
      b.y + b.height < a.y
    );
  }
}
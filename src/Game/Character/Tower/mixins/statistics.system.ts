import { DamageStatisticsObserver } from "../tower.types";

export class StatisticsSystem {
  private observers: DamageStatisticsObserver[] = [];
  public totalDamage = 0;
  public hordeDamage = 0;

  subscribe(callback: DamageStatisticsObserver): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter((cb) => cb !== callback);
    };
  }

  notify(): void {
    const stats = {
      totalDamage: this.totalDamage,
      hordeDamage: this.hordeDamage,
    };
    
    for (const observer of this.observers) {
      observer(stats);
    }
  }
}

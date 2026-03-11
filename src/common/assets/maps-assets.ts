import { getAssetUrl } from "@/common/assets/get-asset-url";
import { PlacementConfig } from "@/Game/Placement";
import {
  Map1Waves,
  Map2Waves,
  Map3Waves,
  Map4Waves,
  Map5Waves,
} from "@/Game/common/hordes";
import i18n from "@/common/providers/i18n";

export const getMaps: () => PlacementConfig[] = () => [
  {
    id: 1,
    nome: i18n.t("desert"),
    descricao: i18n.t("desertDesc"),
    dificuldade: i18n.t("easy"),
    hordas: 10,
    waveIntervalSeconds: 30,
    imagem: getAssetUrl("/assets/images/maps/Map_1.png"),
    waves: Map1Waves,
    gridColor: 0x595959,
    tileTint: 0xf2d7a0, // areia clara
    dirtTint: 0xc58b3a, // terra mais escura
  },
  {
    id: 2,
    nome: i18n.t("cemitery"),
    descricao: i18n.t("cemiteryDesc"),
    dificuldade: i18n.t("medium"),
    hordas: 15,
    waveIntervalSeconds: 24,
    imagem: getAssetUrl("/assets/images/maps/Map_2.png"),
    waves: Map2Waves.slice(0, 15),
    gridColor: 0x464646,
    tileTint: 0x6a7a6b, // verde acinzentado
    dirtTint: 0x4c4f52, // cinza escuro
  },
  {
    id: 3,
    nome: i18n.t("gardem"),
    descricao: i18n.t("gardemDesc"),
    dificuldade: i18n.t("hard"),
    hordas: 20,
    waveIntervalSeconds: 18,
    imagem: getAssetUrl("/assets/images/maps/Map_3.png"),
    waves: Map3Waves.slice(0, 20),
    gridColor: 0x595959,
    tileTint: 0x88c96b, // verde vivo
    dirtTint: 0x5e8f43, // verde mais escuro
  },
  {
    id: 4,
    nome: i18n.t("iceMap"),
    descricao: i18n.t("iceMapDesc"),
    dificuldade: i18n.t("veryHard"),
    hordas: 25,
    waveIntervalSeconds: 14,
    imagem: getAssetUrl("/assets/images/maps/Map_4.png"),
    waves: Map4Waves.slice(0, 25),
    gridColor: 0x595959,
    tileTint: 0xc8e8ff, // azul bem claro
    dirtTint: 0x7fb2ff, // azul médio
  },
  {
    id: 5,
    nome: i18n.t("hellMap"),
    descricao: i18n.t("hellMapDesc"),
    dificuldade: i18n.t("nightmare"),
    hordas: 40,
    waveIntervalSeconds: 12,
    imagem: getAssetUrl("/assets/images/maps/Map_5.png"),
    waves: Map5Waves.slice(0, 40),
    gridColor: 0x464646,
    tileTint: 0x803030, // vermelho escuro
    dirtTint: 0xff7a3c, // laranja/lava
  },
];

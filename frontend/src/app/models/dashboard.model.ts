export interface DashboardStats {
    respostasEncontradasHoje: number;
    usuariosAtivosCount: number;
    pendenciasCount: number;
    usuariosPendentesCount: number;
}

export interface TaxaRespostasData {
    encontradas: number;
    naoEncontradas: number;
}

export interface VolumeAtendimentosData {
    dia: string;
    count: string;
}
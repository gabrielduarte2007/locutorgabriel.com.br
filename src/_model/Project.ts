import { ProjectType } from './ProjectType';

export interface Project {
    id: string;
    titulo: string;
    subtitulo: string;
    tipo: ProjectType;
    tags: string[];

    imagem?: string;

    youtube?: string;

    soundcloud?: string;

    principal?: boolean;

    imagem_posicao?: 'center' | 'left' | 'right' | string;

    imagem_largura?: string;
    imagem_altura?: string;
}

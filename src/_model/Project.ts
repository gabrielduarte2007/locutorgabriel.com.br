import { ProjectType } from './ProjectType';

export interface Project {
    id: string;
    titulo: string;
    subtitulo: string;

    // Optional custom slug
    slug?: string;

    tipo: ProjectType;
    tags: string[];

    // TODO: Todos os projetos que quiser ter descrição, precisará preencher
    descricao?: string;

    imagem?: string;

    // TODO: Extrair para uma interface de ProjectVideo, para ter validação nos tipos
    youtube?: string;

    // TODO: Extrair para uma interface de ProjectAudio, para ter validação nos tipos
    soundcloud?: string;

    principal?: boolean;

    imagem_posicao?: 'center' | 'left' | 'right' | string;

    imagem_largura?: string;
    imagem_altura?: string;
}

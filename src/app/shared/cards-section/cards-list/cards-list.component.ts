import { Component } from '@angular/core';

@Component({
    selector: 'app-cards-list',
    templateUrl: './cards-list.component.html',
    styleUrls: ['./cards-list.component.sass'],
})
export class CardsListComponent {
    projectVideo: any[] = [
        {
            id: 'Amazon Prime Video - Grandes Estrelas',
            titulo: 'Amazon Prime',
            subtitulo: 'Grandes Estrelas',
            tipo: 'VIDEO',
            youtube: 'https://youtu.be/CWGIsYA2DS0',
            principal: true,
            tags: [
                'Credibilidade',
                'Folgado',
                'Séries',
                'Adulto',
                'Cinema',
                'Grave',
                'Streaming',
                'Televisão',
                'Trailer',
                'TV',
                'Filmes',
                'Netflix',
                'Sabichão',
                'Malandro',
                'Impostado',
                'Locutor',
                'Locução',
            ],
        },
        {
            id: 'CCXP 2019',
            titulo: 'CCXP',
            subtitulo: '2019',
            tipo: 'VIDEO',
            youtube: 'https://youtu.be/UqKgK_ceZBg',
            principal: true,
            tags: [
                'Solto',
                'Descolado',
                'Jovem',
                'Oi',
                'Falado',
                'Moderno',
                'Games',
                'Comic Con',
                'Engraçado',
                'Desenho Animado',
                'Feira',
                'Evento',
                'Rápido',
                'Blasé',
                'Malandro',
                'Ironia',
                'Divertido',
                'Locutor',
                'Locução',
            ],
        },
        {
            id: 'Volkswagen - Nivus',
            titulo: 'Volkswagen',
            subtitulo: 'Lançamento Nivus',
            tipo: 'VIDEO',
            youtube: 'https://youtu.be/Z5QNwzfccqM',
            imagem_posicao: 'center',
            imagem_altura: '180%',
            principal: true,
            tags: [
                'Carro',
                'Assinatura',
                'Moderno',
                'Descolado',
                'Rico',
                'Exclusivo',
                'Moderno',
                'Grave',
                'Segurança',
                'Sério',
                'Bravo',
                'Aerado',
                'Pesado',
                'Folgado',
                'Impostado',
                'Locutor',
                'Locução',
            ],
        },
    ];
}

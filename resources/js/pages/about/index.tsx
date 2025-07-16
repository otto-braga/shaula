import PublicLayout from '@/layouts/public-layout';

export default function Index() {
    return (
        <PublicLayout head="SHAULA">
            <div className="grid p-4 md:grid-cols-3 md:p-8">
                <section></section>
                <section className="space-y-8 text-lg">
                    <p>
                        O portal SHAULA (nome da estrela que, na bandeira do Brasil, representa o RN) é um espaço de memória dedicado à arte potiguar,
                        que reúne e disponibiliza conteúdos, na sua maioria produzidos por docentes e discentes do Curso de Artes Visuais da UFRN e
                        pelos membros do Matizes – Grupo de Pesquisa em Artes Visuais, cadastrado no CNPq (
                        <a className="underline" target="_blank" href="http://dgp.cnpq.br/dgp/espelhogrupo/752417">
                            http://dgp.cnpq.br/dgp/espelhogrupo/752417
                        </a>
                        ).
                    </p>
                    <p>
                        Entende-se, por arte potiguar, aquela produzida no Rio Grande do Norte ou por artistas nascidos aqui, mas radicados/as em
                        outros locais, nas diferentes linguagens visuais (pintura, escultura, gravura, cerâmica, instalações, performances, entre
                        outras) e em arquitetura, em diferentes períodos (do pré-colonial aos dias atuais). Além das obras e autores, também são
                        considerados diversos elementos que ajudam a entender a arte em sua totalidade, tais como: processos criativos, narrativas
                        históricas, críticas, movimentos, entre outros.
                    </p>
                    <p>
                        O portal é produto do projeto de extensão universitária intitulado SHAULA - Memória da arte potiguar, este conta com o apoio
                        da Pró-reitoria de Extensão - PROEX. O projeto tem um duplo objetivo. Por um lado, estimular a produção de novos conhecimentos
                        sobre a arte potiguar, a partir de pesquisas em arquivos de instituições diversas (fundações, institutos, museus, galerias,
                        entre outras), da imprensa e de particulares, bem como de depoimentos de pessoas relacionadas ao tema (artistas, curadores,
                        colecionadores, críticos, entre outros) e de estudos de obras, coleções e acervos públicos e privados. Com isso, o projeto
                        contribui para o preenchimento de inúmeras lacunas sobre a história e a memória da arte potiguar, permitindo uma visão mais
                        ampla e atualizada, com bases científicas. Por outro lado, o projeto também possibilita que um público mais abrangente possa
                        conhecer e admirar essa arte.
                    </p>
                </section>
                <section></section>
            </div>
        </PublicLayout>
    );
}

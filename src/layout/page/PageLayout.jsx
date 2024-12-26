import PageAside from "../../components/page/PageAside";

export default function PageLayout({children}){

    return (<>
          <div id='page-container1'>
            <PageAside />
            <section className='page-main1 '>
                {children}
            </section>
            </div>
    </>);
}
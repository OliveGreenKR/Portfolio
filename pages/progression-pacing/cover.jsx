(function buildPacingCover() {
  const D = window.PACING_DATA;
  window.COVERS = window.COVERS || {};
  window.COVERS['progression-pacing'] = {
    toc: { title: D.cover.title, period: D.cover.period, tags: D.cover.tags.map(p=>p.text) },
    render: () => <window.CoverSplit main={<>
      <window.Eyebrow>{D.cover.eyebrow}</window.Eyebrow>
      <window.CoverTitle>{D.cover.title}</window.CoverTitle>
      <window.Lede>{D.cover.lede}</window.Lede>
      <window.RoleLine label={D.cover.roleLabel}>{D.cover.role}</window.RoleLine>
      <p className="mp-cover-boundary">{D.cover.boundary}</p>
      <window.Pills items={D.cover.tags}/>
      <window.Specs items={D.cover.specs}/>
      <p className="mp-cover-ai">{D.cover.ai}</p>
      <window.LinkRow links={D.cover.links}/>
    </>} art={<window.Art img={D.loop.image} alt={D.loop.alt} caption={D.cover.caption}/>}/>,
  };
})();

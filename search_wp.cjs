async function search() {
  const res = await fetch("https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]=steadfast");
  const data = await res.json();
  data.plugins.forEach(p => console.log(p.slug, p.download_link));
}
search();

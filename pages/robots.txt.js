// pages/robots.txt.js
export async function getServerSideProps({ res }) {
  const robots = `
User-agent: *
Allow: /

Sitemap: https://www.househive.ai/sitemap.xml
Host: https://www.househive.ai
  `
  res.setHeader('Content-Type', 'text/plain')
  res.write(robots)
  res.end()
  return { props: {} }
}

export default function Robots() {
  return null
}

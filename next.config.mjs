/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects(){
    return [
      {
        source: '/cosmiccowboys',
        destination: 'https://cosmiccowboys.cloud',
        permanent: false
      },
      {
        source: '/pinatacloud',
        destination: 'https://pinata.cloud/blog',
        permanent: false
      },
            {
        source: '/blog/frame-mint-tutorial',
        destination: 'https://pinata.cloug/blog',
        permanent: false
      },
      {
        source: '/video/frame-mint-tutorial',
        destination: 'https://youtube.com/pinatacloud',
        permanent: false
      }

    ]
  }
};

export default nextConfig;

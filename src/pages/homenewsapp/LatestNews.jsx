import NewsCard from './NewsCard';

const LatestNews = () => {
  const latest = [
    { title: 'Latest Headline 1', excerpt: 'Short description...', image: '/news1.jpg' },
    { title: 'Latest Headline 2', excerpt: 'Short description...', image: '/news2.jpg' },
  ];
  return (
    <>
      <h4 className="mb-3">🆕 Latest News</h4>
      {latest.map((news, idx) => <NewsCard key={idx} {...news} />)}
    </>
  );
};

export default LatestNews;

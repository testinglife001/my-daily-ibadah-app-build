import NewsCard from './NewsCard';

const RecentNews = () => {
  const recent = [
    { title: 'Recent News A', excerpt: 'Some description...', image: '/news3.jpg' },
    { title: 'Recent News B', excerpt: 'Some description...', image: '/news4.jpg' },
  ];
  return (
    <>
      <h4 className="mb-3">📌 Recent News</h4>
      {recent.map((news, idx) => <NewsCard key={idx} {...news} />)}
    </>
  );
};

export default RecentNews;

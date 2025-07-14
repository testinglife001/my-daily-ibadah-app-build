import NewsCard from './NewsCard';

const NewsRow = () => {
  const featured = [
    {
      title: 'Breaking: Peace Talks Resume',
      excerpt: 'Diplomats return to negotiation table after months...',
      image: '/news1.jpg',
    },
    {
      title: 'AI Revolution in 2025',
      excerpt: 'Startups are pushing boundaries of AI in healthcare...',
      image: '/news2.jpg',
    },
  ];

  return (
    <>
      <h4 className="fw-bold text-dark mb-3">📰 Featured Stories</h4>
      <div className="d-flex flex-wrap gap-3 mb-4">
        {featured.map((news, i) => (
          <div key={i} style={{ flex: '1 1 48%' }}>
            <NewsCard {...news} />
          </div>
        ))}
      </div>
    </>
  );
};

export default NewsRow;

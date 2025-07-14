const TrendingNews = () => {
  const items = [
    '🚨 Govt announces new policy reforms',
    '🌍 Climate summit draws global leaders',
    '📉 Markets fall amid tech layoffs',
  ];

  return (
    <div className="bg-light p-3 mb-4 border-start border-5 border-danger">
      <h5 className="text-danger fw-bold mb-2">🔥 Trending News</h5>
      <ul className="list-unstyled mb-0">
        {items.map((item, i) => (
          <li key={i} className="mb-1">• {item}</li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingNews;

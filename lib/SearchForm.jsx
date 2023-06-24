import { useState } from 'react';

export default function SearchForm() {
  const [hits, setHits] = useState([]);

  const search = async (e) => {
    const query = e.target.value;

    if (query.length > 2) {
      const params = new URLSearchParams({ query });

      const res = await fetch(`/api/search?${params}`);

      const result = await res.json();
      console.log(result);
      setHits(result['cars']);
    }
  };

  console.log(hits);

  return (
    <div>
      <input
        onChange={search}
        type="text"
        placeholder="Search for cars..."
        className="form-control"
      />

      <ul className="list-group">
        {
          hits.map((hit) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-start"
              key={hit.entityId}
            >
              <img alt="" height={50} width={50} src={hit.image} />

              <div className="ms-2 me-auto">
                <div className="fw-bold">
                  {hit.make} {hit.model}
                </div>
                {hit.description}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

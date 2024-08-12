import React, { useEffect, useState } from 'react';

export default function CartDisplay({ data, func, ke, deletes }) {
  const [selectedOption, setSelectedOption] = useState(1);

  useEffect(() => {
    const sq = localStorage.getItem(`savedqty${ke}`);
    if (sq) {
      setSelectedOption(sq);
      func(ke, data.price, sq);
    } else {
      setSelectedOption(1);
    }
  }, [ke, func, data.price]);

  function handleChange(e) {
    setSelectedOption(e.target.value);
    func(ke, data.price, e.target.value);
    localStorage.setItem(`savedqty${ke}`, e.target.value);
  }

  function deleteCart() {
    deletes(data._id, ke);
  }

  return (
    <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-lg shadow-md p-4">
      <img src={data.image} alt={data.name} className="w-full md:w-1/3 h-auto object-contain rounded-lg mb-4 md:mb-0" />
      <div className="flex flex-col justify-between ml-0 md:ml-4 w-full md:w-2/3">
        <div className="text-center md:text-left">
          <b className="block text-lg font-semibold text-gray-700" >{data.name}</b>
          <b className="block text-gray-500 mt-2">{data.price}</b>
          <b className="block text-gray-500 mt-2">Category: {data.category}</b>
        </div>
        <div className="flex flex-col items-center md:items-start mt-4">
          <select
            value={selectedOption}
            onChange={handleChange}
            className="py-1 px-2 border border-gray-300 rounded-lg mb-2 text-gray-700 "
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <button
            className="text-red-500 font-bold hover:text-red-700 focus:outline-none"
            onClick={deleteCart}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

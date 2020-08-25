const container = document.querySelector('.container');
const form = document.querySelector('form');

form.onsubmit = async (e) => {
  e.preventDefault();
  const channelURL = form.url.value;

  const res = await fetch('http://localhost:5000/creators', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channelURL }),
  });
  // .then((res) => res.json())
  // .then((data) => loadCreators(data));

  const data = await res.json();
  await loadData(data, 'creators');
};

function newEl(type, attrs = {}) {
  const el = document.createElement(type);

  for (let attr in attrs) {
    // console.log(typeof attr); ////string src innertext,class

    const value = attrs[attr];
    if (attr === 'innerText') el.innerText = value;
    else el.setAttribute(attr, value);
  }

  return el;
}

async function loadData(data, endPoint) {
  const res = !data && (await fetch(`http://localhost:5000/${endPoint}`));
  const results = !!data ? data : await res.json();

  const Arr = results?.map((item) => {
    const card = newEl('div', { class: 'card card-body' });
    const title =
      endPoint.split('?')[0] === 'top-news'
        ? newEl('a', {
            innerText: `${item.name}`,
            href: `${item.link}`,
            target: '_blank',
            class: 'link',
          })
        : newEl('h4', {
            innerText: `${item.name}`,
          });
    const order =
      endPoint.split('?')[0] === 'top-news'
        ? newEl('h4', {
            innerText: `${item.order}`,
            class: 'order',
          })
        : '';

    const img = !!item.img && newEl('img', { src: item.img });
    // img.style.width = '100px';

    !!img && card.appendChild(img);
    !!order && card.appendChild(order);
    card.appendChild(title);

    // card.onclick = () => {
    //   window.location.href = item.link;
    //   console.log('helo');
    // };
    return card.outerHTML;
    // container.appendChild(card);
  });

  container.innerHTML = Arr.join('');
}

// loadData(null, 'creators');
let searchParams;
function outputHTML(type) {
  switch (type) {
    case 'Coding Channels':
      form.style.display = 'block';
      container.innerHTML = '';
      return loadData(null, 'creators');
    case 'top-10-series':
      form.style.display = 'none';
      container.innerHTML = '';
      searchParams = new URLSearchParams({
        url: 'http://www.allocine.fr/series/meilleures/',
      });
      return loadData(null, `top-series?${searchParams}`);
    case 'top-10-films':
      form.style.display = 'none';
      container.innerHTML = '';
      searchParams = new URLSearchParams({
        url: 'http://www.allocine.fr/film/meilleurs/',
      });
      return loadData(null, `top-films?${searchParams}`);
    case 'top-10-news':
      form.style.display = 'none';
      container.innerHTML = '';
      searchParams = new URLSearchParams({
        url: 'https://www.bbc.com/news',
      });
      return loadData(null, `top-news?${searchParams}`);
    default:
      container.innerHTML = '';
      return loadData(null, 'creators');
  }
}

outputHTML(null, 'Coding Channels');

// async function loadCreators(data, endPoint) {
//   const res = !data && (await fetch(`http://localhost:5000/${endPoint}`));
//   const creators = !!data ? data : await res.json();

//   console.log(creators);

//   const creatorArr = creators?.map((creator) => {
//     const card = newEl('div', { class: 'card' });
//     const title = newEl('h4', { innerText: creator.name });
//     const img = newEl('img', { src: creator.img });
//     // img.style.width = '100px';

//     card.appendChild(img);
//     card.appendChild(title);
//     return card.outerHTML;
//     // container.appendChild(card);
//   });

//   console.log(creatorArr);

//   container.innerHTML = creatorArr.join('');
// }

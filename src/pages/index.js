import Arrow from '../assets/icon-arrow.svg';

import { Container, SearchInfos, SearchSection, MapContainer } from '../styles/HomeStyles';

export default function Home() {
  const searchInfos = [
    {
      title: 'IP Address',
      description: '192.000.0.000',
    },
    {
      title: 'Location',
      description: 'Rio de janeiro, BR',
      br: '10001'
    },
    {
      title: 'Timezone',
      description: 'UTC',
    },
    {
      title: 'ISP',
      description: 'SpaceX',
    },
  ];

  return (
    <Container>
      <SearchSection results={true}>
        <h2>IP address Tracker</h2>

        <div>
          <input type="text" placeholder="Search for any IP address or domain" />
          <button><Arrow /></button>
        </div>

        <SearchInfos>
          <ul>
            {searchInfos.map((item, key) => (
              <>
                <li key={key}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description} {item.br ? item.br : ''}</p>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </SearchInfos>
      </SearchSection>

      <MapContainer />
    </Container>
  )
}

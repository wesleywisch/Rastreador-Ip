import { useEffect, useState } from 'react';
import Arrow from '../assets/icon-arrow.svg';

import { Container, SearchInfos, SearchSection, MapContainer } from '../styles/HomeStyles';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [results, setResults] = useState({});

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    async function getInitialData() {
      try {
        setLoading(true);

        const response = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}`)
          .then(response => response.json())
          .then(data => setResults(data));

        if (response.status !== 200) {
          throw new Error();
        };

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getInitialData();
  }, []);

  async function handleSearchInApi() {
    if (!ipAddress) {
      alert('Por favor escreva algum IP!');
      return;
    }

    try {
      setLoading(true);

      // Verificação (regex) se é realmente um IP.
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress)) {
        const response = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${ipAddress}`)
          .then(response => response.json())
          .then(data => setResults(data));

        if (response.status !== 200) {
          throw new Error();
        };
      } else {
        // Verificação que se não é um ip então é um domínio.
        const response = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&domain=${ipAddress}`)
          .then(response => response.json())
          .then(data => setResults(data));

        if (response.status !== 200) {
          throw new Error();
        };
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <Container>
      <SearchSection results={results.location}>
        <h2>IP address Tracker</h2>

        <div>
          <input
            type="text"
            placeholder="Search for any IP address or domain"
            onChange={(e) => setIpAddress(e.target.value)}
            value={ipAddress}
          />
          <button onClick={handleSearchInApi}><Arrow /></button>
        </div>

        {results?.location && (
          <SearchInfos>
            <ul>
              <li>
                <div>
                  <strong>IP Address</strong>
                  <p>{results.ip}</p>
                </div>
              </li>

              <li>
                <div>
                  <strong>Location</strong>
                  <p>{`${results.location.region}, ${results.location.country}`}<br /></p>
                </div>
              </li>

              <li>
                <div>
                  <strong>Timezone</strong>
                  <p>UTC {results.location.timezone}</p>
                </div>
              </li>

              <li>
                <div>
                  <strong>ISP</strong>
                  <p>{results.isp}</p>
                </div>
              </li>
            </ul>
          </SearchInfos>
        )}
      </SearchSection>

      <MapContainer />
    </Container>
  )
}

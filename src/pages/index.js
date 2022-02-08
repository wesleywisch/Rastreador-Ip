import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { toast } from 'react-toastify';

import Arrow from '../assets/icon-arrow.svg';

import { Spinner } from '../components/Spinner';
const Map = dynamic(() => import('../components/Map'), { ssr: false });

import { Container, SearchInfos, SearchSection, MapContainer } from '../styles/HomeStyles';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [results, setResults] = useState({});

  const defaultPosition = [-23.550520, -46.633308];

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  async function handleSearchInApi() {
    if (!ipAddress) {
      alert('Por favor escreva algum IP!');
      return;
    }

    try {
      setLoading(true);

      // Verificação (regex) se é realmente um IP.
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress)) {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`)
          .then(response => response.json())
          .then(data => setResults(data));

        if (response.status !== 200) {
          throw new Error();
        };
      } else {
        // Verificação que se não é um ip então é um domínio.
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&domain=${ipAddress}`)
          .then(response => response.json())
          .then(data => setResults(data));

        if (response.status !== 200) {
          throw new Error();
        };
      }

    } catch (err) {
      // toast.error("An error ocurred while searching for this IP or domain! Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function getInitialData() {
      try {
        setLoading(true);

        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`)
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

  useEffect(() => {
    toast.warn("Please disable ADBlock for the application to work normally", {
      autoClose: '10000',
    });
  }, [])

  return (
    <Container>
      <Head>
        <title>IP Address Tracker - Find any IP address or domain easily</title>
      </Head>

      <SearchSection results={results.location}>
        <h2>IP address Tracker</h2>

        <div>
          <input
            type="text"
            placeholder="Search for any IP address or domain"
            onChange={(e) => setIpAddress(e.target.value)}
            value={ipAddress}
          />
          <button
            disabled={!!loading}
            onClick={handleSearchInApi}
          >
            {loading ? <Spinner /> : <Arrow />}
          </button>
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
                  <p>{`${results.location.city}, ${results.location.country}`}<br /> {results.location.region}</p>
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

      <MapContainer loading={loading}>
        <Map
          defaultPosition={defaultPosition}
          location={
            results.location ?
              [results.location.lat, results.location.lng] : defaultPosition
          }
        />
      </MapContainer>
    </Container>
  )
}

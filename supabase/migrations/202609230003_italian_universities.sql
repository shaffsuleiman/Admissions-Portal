-- Complete Italian university directory from the official MUR USTAT catalogue.
-- Source checked 2026-09-23: https://ustat.mur.gov.it/dati/didattica/italia/atenei

create table public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  country_code text not null default 'IT' check (country_code = 'IT'),
  region text not null,
  institution_type text not null check (institution_type in ('Statale', 'Non statale')),
  is_telematic boolean not null default false,
  mur_source_url text not null unique,
  directory_verified_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index universities_region_idx on public.universities(region);
create index universities_type_idx on public.universities(institution_type, is_telematic);

alter table public.universities enable row level security;
revoke all on public.universities from anon, authenticated;
grant select on public.universities to authenticated;
create policy universities_select on public.universities
  for select to authenticated using (true);

create trigger universities_set_updated_at
  before update on public.universities
  for each row execute procedure public.set_updated_at();

alter table public.programmes
  add column university_id uuid references public.universities(id) on delete set null;
create index programmes_university_id_idx on public.programmes(university_id);

insert into public.universities (
  slug, name, region, institution_type, is_telematic, mur_source_url, directory_verified_at
)
select slug, name, region, institution_type, is_telematic, mur_source_url, checked_at
from (values
  ('torino', 'Università degli studi di Torino', 'Piemonte', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/torino'),
  ('torino-politecnico', 'Politecnico di Torino', 'Piemonte', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/torino-politecnico'),
  ('piemonte-orientale', 'Università degli studi del Piemonte orientale "Amedeo Avogadro"', 'Piemonte', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/piemonte-orientale'),
  ('bra-scienze-gastronomiche', 'Università di Scienze Gastronomiche', 'Piemonte', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/bra-scienze-gastronomiche'),
  ('aosta', 'Università della Valle d''Aosta', 'Valle D''Aosta', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/aosta'),
  ('genova', 'Università degli studi di Genova', 'Liguria', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/genova'),
  ('castellanza-liuc', 'Università "Carlo Cattaneo" (LIUC)', 'Lombardia', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/castellanza-liuc'),
  ('insubria', 'Università degli Studi dell'' Insubria', 'Lombardia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/insubria'),
  ('novedrate-e-campus', 'Università telematica "e-Campus" di Novedrate (CO)', 'Lombardia', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/novedrate-e-campus'),
  ('milano', 'Università degli Studi di Milano', 'Lombardia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/milano'),
  ('milano-politecnico', 'Politecnico di Milano', 'Lombardia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/milano-politecnico'),
  ('milano-bocconi', 'Università Commerciale Luigi Bocconi di Milano', 'Lombardia', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/milano-bocconi'),
  ('milano-cattolica', 'Università Cattolica del "Sacro Cuore"', 'Lombardia', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/milano-cattolica'),
  ('milano-iulm', 'Libera Università di Lingue e Comunicazione (IULM)', 'Lombardia', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/milano-iulm'),
  ('milano-san-raffaele', 'Libera Università, Vita-Salute San Raffaele di Milano', 'Lombardia', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/milano-san-raffaele'),
  ('milano-bicocca', 'Università degli studi di Milano-Bicocca', 'Lombardia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/milano-bicocca'),
  ('rozzano-mi-humanitas-university', 'Humanitas University', 'Lombardia', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/rozzano-mi-humanitas-university'),
  ('bergamo', 'Università degli Studi di Bergamo', 'Lombardia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/bergamo'),
  ('brescia', 'Università degli Studi di Brescia', 'Lombardia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/brescia'),
  ('pavia', 'Università degli Studi di Pavia', 'Lombardia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/pavia'),
  ('pavia-iuss', 'Istituto universitario di studi superiori di Pavia', 'Lombardia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/pavia-iuss'),
  ('bolzano', 'Libera Università di Bolzano', 'Trentino-Alto Adige', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/bolzano'),
  ('trento', 'Università degli Studi di Trento', 'Trentino-Alto Adige', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/trento'),
  ('verona', 'Università degli Studi di Verona', 'Veneto', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/verona'),
  ('venezia-ca-foscari', 'Università degli studi Ca'' Foscari di Venezia', 'Veneto', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/venezia-ca-foscari'),
  ('venezia-iuav', 'Università Iuav di Venezia', 'Veneto', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/venezia-iuav'),
  ('padova', 'Università degli Studi di Padova', 'Veneto', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/padova'),
  ('udine', 'Università degli Studi di Udine', 'Friuli-Venezia Giulia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/udine'),
  ('trieste', 'Università degli Studi di Trieste', 'Friuli-Venezia Giulia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/trieste'),
  ('trieste-sissa', 'Scuola Internazionale Superiore di Studi Avanzati di Trieste', 'Friuli-Venezia Giulia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/trieste-sissa'),
  ('parma', 'Università degli Studi di Parma', 'Emilia-Romagna', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/parma'),
  ('modena-e-reggio-emilia', 'Università degli Studi di Modena e Reggio Emilia', 'Emilia-Romagna', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/modena-e-reggio-emilia'),
  ('bologna', 'Università degli Studi di Bologna', 'Emilia-Romagna', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/bologna'),
  ('ferrara', 'Università degli Studi di Ferrara', 'Emilia-Romagna', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/ferrara'),
  ('urbino-carlo-bo', 'Università degli studi "Carlo Bo" di Urbino', 'Marche', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/urbino-carlo-bo'),
  ('marche', 'Università Politecnica delle Marche - Ancona', 'Marche', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/marche'),
  ('macerata', 'Università degli Studi di Macerata', 'Marche', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/macerata'),
  ('camerino', 'Università degli Studi di Camerino', 'Marche', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/camerino'),
  ('lucca-imt', 'Scuola IMT Alti Studi di Lucca', 'Toscana', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/lucca-imt'),
  ('firenze', 'Università degli Studi di Firenze', 'Toscana', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/firenze'),
  ('firenze-iul', 'Università telematica "Italian University line" di Firenze', 'Toscana', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/firenze-iul'),
  ('pisa', 'Università di Pisa', 'Toscana', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/pisa'),
  ('pisa-normale', 'Scuola Normale Superiore di Pisa', 'Toscana', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/pisa-normale'),
  ('pisa-s-anna', 'Scuola Superiore di Studi Universitari e Perfezionamento "S. Anna" di Pisa', 'Toscana', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/pisa-s-anna'),
  ('siena', 'Università degli Studi di Siena', 'Toscana', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/siena'),
  ('siena-stranieri', 'Università per stranieri di Siena', 'Toscana', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/siena-stranieri'),
  ('perugia', 'Università degli Studi di Perugia', 'Umbria', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/perugia'),
  ('perugia-stranieri', 'Università per stranieri di Perugia', 'Umbria', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/perugia-stranieri'),
  ('tuscia', 'Università degli Studi della Tuscia', 'Lazio', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/tuscia'),
  ('sapienza', 'Università degli studi di Roma La Sapienza', 'Lazio', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/sapienza'),
  ('roma-tor-vergata', 'Università degli Studi di Roma Tor Vergata', 'Lazio', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/roma-tor-vergata'),
  ('roma-lumsa', 'Libera Università Maria SS.Assunta - (LUMSA) di Roma', 'Lazio', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-lumsa'),
  ('roma-luiss', 'LUISS - Libera Università internazionale degli studi sociali Guido Carli di Roma', 'Lazio', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-luiss'),
  ('roma-foro-italico', 'Università degli studi di Roma "Foro Italico"', 'Lazio', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/roma-foro-italico'),
  ('roma-tre', 'Università degli Studi Roma Tre', 'Lazio', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/roma-tre'),
  ('roma-biomedico', 'Università Campus Bio-medico di Roma', 'Lazio', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-biomedico'),
  ('roma-unint', 'Università degli Studi Internazionali di Roma – UNINT', 'Lazio', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-unint'),
  ('roma-marconi', 'Università telematica Guglielmo Marconi di Roma', 'Lazio', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-marconi'),
  ('roma-unitelma', 'Università telematica Unitelma Sapienza di Roma', 'Lazio', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-unitelma'),
  ('roma-europea', 'Università Europea di Roma', 'Lazio', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-europea'),
  ('roma-uninettuno', 'Università telematica internazionale UNINETTUNO di Roma', 'Lazio', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-uninettuno'),
  ('roma-mercatorum', 'Universitas telematica Mercatorum di Roma', 'Lazio', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-mercatorum'),
  ('roma-unicusano', 'Università telematica Niccolò Cusano di Roma', 'Lazio', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-unicusano'),
  ('roma-san-raffaele', 'Università telematica "San Raffaele" di Roma - già "UNITEL"', 'Lazio', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-san-raffaele'),
  ('roma-link-campus', 'Link Campus University di Roma', 'Lazio', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/roma-link-campus'),
  ('Saint-Camillus', 'Saint Camillus International University of Health', 'Lazio', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/Saint-Camillus'),
  ('casd-roma', 'Centro Alti Studi per la Difesa (CASD) di Roma', 'Lazio', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/casd-roma'),
  ('cassino', 'Università degli Studi di Cassino e del Lazio Meridionale', 'Lazio', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/cassino'),
  ('sannio', 'Università degli Studi del Sannio', 'Campania', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/sannio'),
  ('benevento-giustino-fortunato', 'Università telematica "Giustino Fortunato" di Benevento', 'Campania', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/benevento-giustino-fortunato'),
  ('napoli-federico-ii', 'Università degli studi di Napoli Federico II', 'Campania', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/napoli-federico-ii'),
  ('napoli-parthenope', 'Università degli Studi di Napoli - Parthenope', 'Campania', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/napoli-parthenope'),
  ('napoli-l-orientale', 'Università degli studi L''Orientale di Napoli', 'Campania', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/napoli-l-orientale'),
  ('napoli-benincasa', 'Università degli studi Suor Orsola Benincasa di Napoli', 'Campania', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/napoli-benincasa'),
  ('napoli-ii', 'Università degli studi della Campania "Luigi Vanvitelli"', 'Campania', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/napoli-ii'),
  ('napoli-pegaso', 'Università telematica "Pegaso" di Napoli', 'Campania', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/napoli-pegaso'),
  ('napoli-meridionale', 'Scuola Superiore Meridionale di Napoli', 'Campania', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/napoli-meridionale'),
  ('salerno', 'Università degli Studi di Salerno', 'Campania', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/salerno'),
  ('l-aquila', 'Università degli studi di L''Aquila', 'Abruzzo', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/l-aquila'),
  ('l-gransasso', 'Gran Sasso Science Institute - Scuola di dottorato internazionale dell''Aquila', 'Abruzzo', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/l-gransasso'),
  ('teramo', 'Università degli Studi di Teramo', 'Abruzzo', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/teramo'),
  ('chieti-e-pescara', 'Università degli studi Gabriele D''Annunzio di Chieti e Pescara', 'Abruzzo', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/chieti-e-pescara'),
  ('torrevecchia-teatina-leonardo-da-vinci', 'Università telematica non statale "Leonardo da Vinci" di Torrevecchia Teatina (CH)', 'Abruzzo', 'Non statale', true, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/torrevecchia-teatina-leonardo-da-vinci'),
  ('molise', 'Università degli Studi del Molise', 'Molise', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/molise'),
  ('foggia', 'Università degli Studi di Foggia', 'Puglia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/foggia'),
  ('bari', 'Università degli Studi di Bari', 'Puglia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/bari'),
  ('bari-politecnico', 'Politecnico di Bari', 'Puglia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/bari-politecnico'),
  ('casamassima-j-monnet', 'Libera Università Mediterranea LUM "Giuseppe Degennaro"', 'Puglia', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/casamassima-j-monnet'),
  ('salento', 'Università del Salento', 'Puglia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/salento'),
  ('basilicata', 'Università degli studi della Basilicata', 'Basilicata', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/basilicata'),
  ('calabria', 'Università della Calabria', 'Calabria', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/calabria'),
  ('catanzaro', 'Università degli studi di Catanzaro - Magna Grecia', 'Calabria', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/catanzaro'),
  ('reggio-calabria', 'Università degli studi Mediterranea di Reggio Calabria', 'Calabria', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/reggio-calabria'),
  ('reggio-calabria-dante-alighieri', 'Università per stranieri "Dante Alighieri" di Reggio Calabria', 'Calabria', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/reggio-calabria-dante-alighieri'),
  ('palermo', 'Università degli Studi di Palermo', 'Sicilia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/palermo'),
  ('messina', 'Università degli Studi di Messina', 'Sicilia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/messina'),
  ('enna-kore', 'Libera Università della Sicilia Centrale "KORE" di Enna', 'Sicilia', 'Non statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-non-statali/enna-kore'),
  ('catania', 'Università degli Studi di Catania', 'Sicilia', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/catania'),
  ('sassari', 'Università degli Studi di Sassari', 'Sardegna', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/sassari'),
  ('cagliari', 'Università degli Studi di Cagliari', 'Sardegna', 'Statale', false, 'https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/cagliari')
) as official_directory(slug, name, region, institution_type, is_telematic, mur_source_url)
cross join lateral (select '2026-09-23T00:00:00Z'::timestamptz as checked_at) verification
on conflict (slug) do update set
  name = excluded.name,
  region = excluded.region,
  institution_type = excluded.institution_type,
  is_telematic = excluded.is_telematic,
  mur_source_url = excluded.mur_source_url,
  directory_verified_at = excluded.directory_verified_at;

update public.programmes set university_id = (select id from public.universities where slug = 'padova')
where university_name = 'University of Padua';
update public.programmes set university_id = (select id from public.universities where slug = 'bologna')
where university_name = 'University of Bologna';
update public.programmes set university_id = (select id from public.universities where slug = 'torino-politecnico')
where university_name = 'Politecnico di Torino';
update public.programmes set university_id = (select id from public.universities where slug = 'milano')
where university_name = 'University of Milan';
update public.programmes set university_id = (select id from public.universities where slug = 'pisa')
where university_name = 'University of Pisa';
update public.programmes set university_id = (select id from public.universities where slug = 'venezia-ca-foscari')
where university_name = 'Ca'' Foscari University';

comment on table public.universities is
  'Complete official Italian university directory sourced from MUR USTAT. Institution presence does not imply programme admission rules are verified.';


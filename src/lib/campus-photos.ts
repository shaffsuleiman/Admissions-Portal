// Campus photos for each university, from Wikimedia Commons under free licences.
// Generated from the photo review; keyed by university slug and looked up by exact name.
import type { StaticImageData } from "next/image";

import bariPhoto from "../../public/images/campus/u/bari.jpg";
import bariPolitecnicoPhoto from "../../public/images/campus/u/bari-politecnico.jpg";
import bergamoPhoto from "../../public/images/campus/u/bergamo.jpg";
import bolognaPhoto from "../../public/images/campus/u/bologna.jpg";
import bolzanoPhoto from "../../public/images/campus/u/bolzano.jpg";
import braScienzeGastronomichePhoto from "../../public/images/campus/u/bra-scienze-gastronomiche.jpg";
import bresciaPhoto from "../../public/images/campus/u/brescia.jpg";
import cagliariPhoto from "../../public/images/campus/u/cagliari.jpg";
import calabriaPhoto from "../../public/images/campus/u/calabria.jpg";
import camerinoPhoto from "../../public/images/campus/u/camerino.jpg";
import cataniaPhoto from "../../public/images/campus/u/catania.jpg";
import catanzaroPhoto from "../../public/images/campus/u/catanzaro.jpg";
import ferraraPhoto from "../../public/images/campus/u/ferrara.jpg";
import firenzePhoto from "../../public/images/campus/u/firenze.jpg";
import genovaPhoto from "../../public/images/campus/u/genova.jpg";
import insubriaPhoto from "../../public/images/campus/u/insubria.jpg";
import macerataPhoto from "../../public/images/campus/u/macerata.jpg";
import marchePhoto from "../../public/images/campus/u/marche.jpg";
import messinaPhoto from "../../public/images/campus/u/messina.jpg";
import milanoPhoto from "../../public/images/campus/u/milano.jpg";
import milanoBicoccaPhoto from "../../public/images/campus/u/milano-bicocca.jpg";
import milanoCattolicaPhoto from "../../public/images/campus/u/milano-cattolica.jpg";
import milanoIulmPhoto from "../../public/images/campus/u/milano-iulm.jpg";
import milanoPolitecnicoPhoto from "../../public/images/campus/u/milano-politecnico.jpg";
import milanoSanRaffaelePhoto from "../../public/images/campus/u/milano-san-raffaele.jpg";
import modenaEReggioEmiliaPhoto from "../../public/images/campus/u/modena-e-reggio-emilia.jpg";
import napoliFedericoIiPhoto from "../../public/images/campus/u/napoli-federico-ii.jpg";
import napoliIiPhoto from "../../public/images/campus/u/napoli-ii.jpg";
import napoliParthenopePhoto from "../../public/images/campus/u/napoli-parthenope.jpg";
import padovaPhoto from "../../public/images/campus/u/padova.jpg";
import parmaPhoto from "../../public/images/campus/u/parma.jpg";
import paviaPhoto from "../../public/images/campus/u/pavia.jpg";
import piemonteOrientalePhoto from "../../public/images/campus/u/piemonte-orientale.jpg";
import pisaPhoto from "../../public/images/campus/u/pisa.jpg";
import reggioCalabriaPhoto from "../../public/images/campus/u/reggio-calabria.jpg";
import romaBiomedicoPhoto from "../../public/images/campus/u/roma-biomedico.jpg";
import romaEuropeaPhoto from "../../public/images/campus/u/roma-europea.jpg";
import romaForoItalicoPhoto from "../../public/images/campus/u/roma-foro-italico.jpg";
import romaLinkCampusPhoto from "../../public/images/campus/u/roma-link-campus.jpg";
import romaLuissPhoto from "../../public/images/campus/u/roma-luiss.jpg";
import romaTorVergataPhoto from "../../public/images/campus/u/roma-tor-vergata.jpg";
import romaTrePhoto from "../../public/images/campus/u/roma-tre.jpg";
import salernoPhoto from "../../public/images/campus/u/salerno.jpg";
import sapienzaPhoto from "../../public/images/campus/u/sapienza.jpg";
import sassariPhoto from "../../public/images/campus/u/sassari.jpg";
import sienaPhoto from "../../public/images/campus/u/siena.jpg";
import teramoPhoto from "../../public/images/campus/u/teramo.jpg";
import torinoPhoto from "../../public/images/campus/u/torino.jpg";
import torinoPolitecnicoPhoto from "../../public/images/campus/u/torino-politecnico.jpg";
import trentoPhoto from "../../public/images/campus/u/trento.jpg";
import triestePhoto from "../../public/images/campus/u/trieste.jpg";
import tusciaPhoto from "../../public/images/campus/u/tuscia.jpg";
import udinePhoto from "../../public/images/campus/u/udine.jpg";
import veneziaCaFoscariPhoto from "../../public/images/campus/u/venezia-ca-foscari.jpg";
import veneziaIuavPhoto from "../../public/images/campus/u/venezia-iuav.jpg";
import veronaPhoto from "../../public/images/campus/u/verona.jpg";

export type CampusPhoto = {
  slug: string;
  university: string;
  // How programme and application records name the same university.
  otherNames: string[];
  photo: StaticImageData;
  place: string;
  author: string;
  license: string;
  source: string;
};

export const CAMPUS_PHOTOS: CampusPhoto[] = [
  {
    slug: "bari",
    university: "Università degli Studi di Bari",
    otherNames: ["University of Bari"],
    photo: bariPhoto,
    place: "Facciata dell'ateneo principale dell'Università degli Studi di Bari Aldo Moro",
    author: "Augusto Aulenta",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Facciata_dell%27ateneo_principale_dell%27Universit%C3%A0_degli_Studi_di_Bari_Aldo_Moro.jpg",
  },
  {
    slug: "bari-politecnico",
    university: "Politecnico di Bari",
    otherNames: [],
    photo: bariPolitecnicoPhoto,
    place: "Politecnico di Bari",
    author: "SkyFrank",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Politecnico_di_Bari.png",
  },
  {
    slug: "bergamo",
    university: "Università degli Studi di Bergamo",
    otherNames: ["University of Bergamo"],
    photo: bergamoPhoto,
    place: "Università di Bergamo, sede Caniana, ingresso",
    author: "University of Bergamo",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Universit%C3%A0_di_Bergamo,_sede_Caniana,_ingresso.jpg",
  },
  {
    slug: "bologna",
    university: "Università degli Studi di Bologna",
    otherNames: ["University of Bologna"],
    photo: bolognaPhoto,
    place: "Cà Grande dei Malvezzi - Sala Borsa 06",
    author: "Wikimedia Commons contributor",
    license: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:C%C3%A0_Grande_dei_Malvezzi_-_Sala_Borsa_06.jpg",
  },
  {
    slug: "bolzano",
    university: "Libera Università di Bolzano",
    otherNames: ["Free University of Bozen-Bolzano"],
    photo: bolzanoPhoto,
    place: "University of Bozen 1 (96)",
    author: "User:Mattes",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:University_of_Bozen_1_(96).jpg",
  },
  {
    slug: "bra-scienze-gastronomiche",
    university: "Università di Scienze Gastronomiche",
    otherNames: ["University of Gastronomic Sciences"],
    photo: braScienzeGastronomichePhoto,
    place: "Unisg licensed",
    author: "Maurooo",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Unisg_licensed.jpg",
  },
  {
    slug: "brescia",
    university: "Università degli Studi di Brescia",
    otherNames: ["University of Brescia"],
    photo: bresciaPhoto,
    place: "Palazzo Martinengo Palatini (Brescia) fronte",
    author: "RobyBS89",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Palazzo_Martinengo_Palatini_(Brescia)_fronte.JPG",
  },
  {
    slug: "cagliari",
    university: "Università degli Studi di Cagliari",
    otherNames: ["University of Cagliari"],
    photo: cagliariPhoto,
    place: "UniversitàCA5",
    author: "Giova81",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Universit%C3%A0CA5.jpg",
  },
  {
    slug: "calabria",
    university: "Università della Calabria",
    otherNames: ["University of Calabria"],
    photo: calabriaPhoto,
    place: "Unical Rende (CS)",
    author: "Fernando Santopaolo",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Unical_Rende_(CS).jpg",
  },
  {
    slug: "camerino",
    university: "Università degli Studi di Camerino",
    otherNames: ["University of Camerino"],
    photo: camerinoPhoto,
    place: "UNICAM 2012 (3)",
    author: "Marie Čcheidzeová",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:UNICAM_2012_(3).jpg",
  },
  {
    slug: "catania",
    university: "Università degli Studi di Catania",
    otherNames: ["University of Catania"],
    photo: cataniaPhoto,
    place: "Catania BW 2012-10-06 11-26-20",
    author: "Berthold Werner",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Catania_BW_2012-10-06_11-26-20.JPG",
  },
  {
    slug: "catanzaro",
    university: "Università degli studi di Catanzaro - Magna Grecia",
    otherNames: ["Magna Graecia University of Catanzaro"],
    photo: catanzaroPhoto,
    place: "Magna Graecia University of Catanzaro 03",
    author: "Nicholas Gemini",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Magna_Graecia_University_of_Catanzaro_03.jpg",
  },
  {
    slug: "ferrara",
    university: "Università degli Studi di Ferrara",
    otherNames: ["University of Ferrara"],
    photo: ferraraPhoto,
    place: "03 Palazzo di Renata di Francia. Noto anche come palazzo di San Francesco, palazzo Gavassini, o palazzo Pareschi",
    author: "Lungoleno",
    license: "CC BY-SA 2.5",
    source: "https://commons.wikimedia.org/wiki/File:03_Palazzo_di_Renata_di_Francia._Noto_anche_come_palazzo_di_San_Francesco,_palazzo_Gavassini,_o_palazzo_Pareschi.jpg",
  },
  {
    slug: "firenze",
    university: "Università degli Studi di Firenze",
    otherNames: ["University of Florence"],
    photo: firenzePhoto,
    place: "Rettorato firenze, aula magna 02",
    author: "sailko",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Rettorato_firenze,_aula_magna_02.JPG",
  },
  {
    slug: "genova",
    university: "Università degli studi di Genova",
    otherNames: ["University of Genoa"],
    photo: genovaPhoto,
    place: "GE Facolta Lettere",
    author: "Microsoikos",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:GE_Facolta_Lettere.jpg",
  },
  {
    slug: "insubria",
    university: "Università degli Studi dell' Insubria",
    otherNames: ["University of Insubria"],
    photo: insubriaPhoto,
    place: "034ComoSAbbondio",
    author: "Geobia",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:034ComoSAbbondio.jpg",
  },
  {
    slug: "macerata",
    university: "Università degli Studi di Macerata",
    otherNames: ["University of Macerata"],
    photo: macerataPhoto,
    place: "University of Macerata Aula Magna",
    author: "Florian Prischl",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:University_of_Macerata_Aula_Magna.jpg",
  },
  {
    slug: "marche",
    university: "Università Politecnica delle Marche - Ancona",
    otherNames: ["Università Politecnica delle Marche"],
    photo: marchePhoto,
    place: "UnivPM-Rettorato",
    author: "Beta16",
    license: "CC BY-SA 3.0 it",
    source: "https://commons.wikimedia.org/wiki/File:UnivPM-Rettorato.jpg",
  },
  {
    slug: "messina",
    university: "Università degli Studi di Messina",
    otherNames: ["University of Messina"],
    photo: messinaPhoto,
    place: "Facoltà di Scienze MFN - esterno 2",
    author: "Ssj5gabry",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Facolt%C3%A0_di_Scienze_MFN_-_esterno_2.jpg",
  },
  {
    slug: "milano",
    university: "Università degli Studi di Milano",
    otherNames: ["University of Milan"],
    photo: milanoPhoto,
    place: "Festa del Perdono Facciata Milano",
    author: "Goldmund100",
    license: "CC BY 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Festa_del_Perdono_Facciata_Milano.jpg",
  },
  {
    slug: "milano-bicocca",
    university: "Università degli studi di Milano-Bicocca",
    otherNames: ["University of Milano-Bicocca"],
    photo: milanoBicoccaPhoto,
    place: "U1 visto da piazza della Scienza, Milano",
    author: "Fabio Visconti",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:U1_visto_da_piazza_della_Scienza,_Milano.jpg",
  },
  {
    slug: "milano-cattolica",
    university: "Università Cattolica del \"Sacro Cuore\"",
    otherNames: ["Università Cattolica del Sacro Cuore"],
    photo: milanoCattolicaPhoto,
    place: "Università Cattolica di Milano (facciata)",
    author: "Paolobon140",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Universit%C3%A0_Cattolica_di_Milano_(facciata).jpg",
  },
  {
    slug: "milano-iulm",
    university: "Libera Università di Lingue e Comunicazione (IULM)",
    otherNames: ["IULM University"],
    photo: milanoIulmPhoto,
    place: "Libera Univeristà di Lingue e Comunicazione IULM, Milano - Edificio 1",
    author: "DaveM93",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Libera_Univerist%C3%A0_di_Lingue_e_Comunicazione_IULM,_Milano_-_Edificio_1.jpg",
  },
  {
    slug: "milano-politecnico",
    university: "Politecnico di Milano",
    otherNames: [],
    photo: milanoPolitecnicoPhoto,
    place: "Polimi Leonardo campus main building",
    author: "NuclearNiranjan",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Polimi_Leonardo_campus_main_building.jpg",
  },
  {
    slug: "milano-san-raffaele",
    university: "Libera Università, Vita-Salute San Raffaele di Milano",
    otherNames: ["Vita-Salute San Raffaele University"],
    photo: milanoSanRaffaelePhoto,
    place: "Ospedale San Raffaele, 2013",
    author: "Mystère Martin",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Ospedale_San_Raffaele,_2013.jpg",
  },
  {
    slug: "modena-e-reggio-emilia",
    university: "Università degli Studi di Modena e Reggio Emilia",
    otherNames: ["University of Modena and Reggio Emilia"],
    photo: modenaEReggioEmiliaPhoto,
    place: "Dipartimento di giurisprudenza dell’Università di Modena",
    author: "Teo Pollastrini",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Dipartimento_di_giurisprudenza_dell%E2%80%99Universit%C3%A0_di_Modena.jpg",
  },
  {
    slug: "napoli-federico-ii",
    university: "Università degli studi di Napoli Federico II",
    otherNames: ["University of Naples Federico II"],
    photo: napoliFedericoIiPhoto,
    place: "Università degli Studi di Napoli Federico II (3542)",
    author: "Giuseppe Guida",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Universit%C3%A0_degli_Studi_di_Napoli_Federico_II_(3542).jpg",
  },
  {
    slug: "napoli-ii",
    university: "Università degli studi della Campania \"Luigi Vanvitelli\"",
    otherNames: ["University of Campania Luigi Vanvitelli"],
    photo: napoliIiPhoto,
    place: "Chiostro Dame",
    author: "Baku",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Chiostro_Dame.jpg",
  },
  {
    slug: "napoli-parthenope",
    university: "Università degli Studi di Napoli - Parthenope",
    otherNames: ["Parthenope University of Naples"],
    photo: napoliParthenopePhoto,
    place: "Università degli Studi di Napoli - Parthenope - sede Acton.png",
    author: "Il mattino",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Universit%C3%A0_degli_Studi_di_Napoli_-_Parthenope_-_sede_Acton.png.jpg",
  },
  {
    slug: "padova",
    university: "Università degli Studi di Padova",
    otherNames: ["University of Padua"],
    photo: padovaPhoto,
    place: "Palazzo Bo (Padua)",
    author: "Didier Descouens",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Palazzo_Bo_(Padua).jpg",
  },
  {
    slug: "parma",
    university: "Università degli Studi di Parma",
    otherNames: ["University of Parma"],
    photo: parmaPhoto,
    place: "Palazzo dell'Università (Parma) - facciata 2017-04-06",
    author: "Parma1983",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Palazzo_dell%27Universit%C3%A0_(Parma)_-_facciata_2017-04-06.jpg",
  },
  {
    slug: "pavia",
    university: "Università degli Studi di Pavia",
    otherNames: ["University of Pavia"],
    photo: paviaPhoto,
    place: "Aula magna-University-Pavia-Italy",
    author: "Giorgio Gonnella",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Aula_magna-University-Pavia-Italy.jpg",
  },
  {
    slug: "piemonte-orientale",
    university: "Università degli studi del Piemonte orientale \"Amedeo Avogadro\"",
    otherNames: ["University of Eastern Piedmont"],
    photo: piemonteOrientalePhoto,
    place: "Università degli studi del Piemonte orientale Sede di Vercelli",
    author: "Betty&Giò",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Universit%C3%A0_degli_studi_del_Piemonte_orientale_Sede_di_Vercelli.jpg",
  },
  {
    slug: "pisa",
    university: "Università di Pisa",
    otherNames: ["University of Pisa"],
    photo: pisaPhoto,
    place: "555PisaPalazzoAllaGiornata",
    author: "Geobia",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:555PisaPalazzoAllaGiornata.JPG",
  },
  {
    slug: "reggio-calabria",
    university: "Università degli studi Mediterranea di Reggio Calabria",
    otherNames: ["Mediterranea University of Reggio Calabria"],
    photo: reggioCalabriaPhoto,
    place: "Reggio Calabria Palazzo Zani",
    author: "Wikimedia Commons contributor",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Reggio_Calabria_Palazzo_Zani.jpg",
  },
  {
    slug: "roma-biomedico",
    university: "Università Campus Bio-medico di Roma",
    otherNames: ["Campus Bio-Medico University of Rome"],
    photo: romaBiomedicoPhoto,
    place: "Policlinico Universitario Campus Bio-Medico visto dal Parco di Decima",
    author: "Luca Borghi",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Policlinico_Universitario_Campus_Bio-Medico_visto_dal_Parco_di_Decima.JPG",
  },
  {
    slug: "roma-europea",
    university: "Università Europea di Roma",
    otherNames: ["European University of Rome"],
    photo: romaEuropeaPhoto,
    place: "Struttura-UER",
    author: "Università europea",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Struttura-UER.jpg",
  },
  {
    slug: "roma-foro-italico",
    university: "Università degli studi di Roma \"Foro Italico\"",
    otherNames: ["University of Rome Foro Italico"],
    photo: romaForoItalicoPhoto,
    place: "Roma Università Foro Italico",
    author: "Blackcat",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Roma_Universit%C3%A0_Foro_Italico.jpg",
  },
  {
    slug: "roma-link-campus",
    university: "Link Campus University di Roma",
    otherNames: ["Link Campus University"],
    photo: romaLinkCampusPhoto,
    place: "Link Campus University",
    author: "Pius79",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Link_Campus_University.png",
  },
  {
    slug: "roma-luiss",
    university: "LUISS - Libera Università internazionale degli studi sociali Guido Carli di Roma",
    otherNames: ["LUISS Guido Carli"],
    photo: romaLuissPhoto,
    place: "LUISS sede centrale Via Pola",
    author: "Carlo Dani",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:LUISS_sede_centrale_Via_Pola.jpeg",
  },
  {
    slug: "roma-tor-vergata",
    university: "Università degli Studi di Roma Tor Vergata",
    otherNames: ["University of Rome Tor Vergata"],
    photo: romaTorVergataPhoto,
    place: "Rettorato dell'Università di Roma Tor Vergata",
    author: "Didimo69",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Rettorato_dell%27Universit%C3%A0_di_Roma_Tor_Vergata.jpg",
  },
  {
    slug: "roma-tre",
    university: "Università degli Studi Roma Tre",
    otherNames: ["Roma Tre University"],
    photo: romaTrePhoto,
    place: "Roma 3 Economia 01821-2",
    author: "Lalupa",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Roma_3_Economia_01821-2.JPG",
  },
  {
    slug: "salerno",
    university: "Università degli Studi di Salerno",
    otherNames: ["University of Salerno"],
    photo: salernoPhoto,
    place: "Vista del campus di Fisciano dall'ingresso nord, Università di Salerno",
    author: "Giuseppe Masino",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Vista_del_campus_di_Fisciano_dall%27ingresso_nord,_Universit%C3%A0_di_Salerno.jpg",
  },
  {
    slug: "sapienza",
    university: "Università degli studi di Roma La Sapienza",
    otherNames: ["Sapienza University of Rome"],
    photo: sapienzaPhoto,
    place: "Sapienza entrance (20040201351)",
    author: "Melirius",
    license: "CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Sapienza_entrance_(20040201351).jpg",
  },
  {
    slug: "sassari",
    university: "Università degli Studi di Sassari",
    otherNames: ["University of Sassari"],
    photo: sassariPhoto,
    place: "Université de Sassari",
    author: "LPLT",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Universit%C3%A9_de_Sassari.JPG",
  },
  {
    slug: "siena",
    university: "Università degli Studi di Siena",
    otherNames: ["University of Siena"],
    photo: sienaPhoto,
    place: "Siena, palazzo dell'università 01",
    author: "Sailko",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Siena,_palazzo_dell%27universit%C3%A0_01.JPG",
  },
  {
    slug: "teramo",
    university: "Università degli Studi di Teramo",
    otherNames: ["University of Teramo"],
    photo: teramoPhoto,
    place: "UniTe facoltà scienze comunicazione",
    author: "S4mb0r4 (Fabio Di Giuseppe)",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:UniTe_facolt%C3%A0_scienze_comunicazione.jpg",
  },
  {
    slug: "torino",
    university: "Università degli studi di Torino",
    otherNames: ["University of Turin"],
    photo: torinoPhoto,
    place: "Palazzo dell'Università (Turin)",
    author: "Derbrauni",
    license: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Palazzo_dell%27Universit%C3%A0_(Turin).jpg",
  },
  {
    slug: "torino-politecnico",
    university: "Politecnico di Torino",
    otherNames: [],
    photo: torinoPolitecnicoPhoto,
    place: "Politecnico Torino",
    author: "Wikimedia Commons contributor",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Politecnico_Torino.JPG",
  },
  {
    slug: "trento",
    university: "Università degli Studi di Trento",
    otherNames: ["University of Trento"],
    photo: trentoPhoto,
    place: "Palazzo Sardagna 2016 2",
    author: "Lungoleno",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Palazzo_Sardagna_2016_2.jpg",
  },
  {
    slug: "trieste",
    university: "Università degli Studi di Trieste",
    otherNames: ["University of Trieste"],
    photo: triestePhoto,
    place: "Università degli studi di Trieste, Italia",
    author: "Tiesse",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Universit%C3%A0_degli_studi_di_Trieste,_Italia.jpg",
  },
  {
    slug: "tuscia",
    university: "Università degli Studi della Tuscia",
    otherNames: ["University of Tuscia"],
    photo: tusciaPhoto,
    place: "ChiostroUniversity",
    author: "Wikimedia Commons contributor",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:ChiostroUniversity.jpg",
  },
  {
    slug: "udine",
    university: "Università degli Studi di Udine",
    otherNames: ["University of Udine"],
    photo: udinePhoto,
    place: "Udine, palazzo florio 01",
    author: "sailko",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Udine,_palazzo_florio_01.JPG",
  },
  {
    slug: "venezia-ca-foscari",
    university: "Università degli studi Ca' Foscari di Venezia",
    otherNames: ["Ca' Foscari University"],
    photo: veneziaCaFoscariPhoto,
    place: "(Venice) Ca' Foscari",
    author: "Didier Descouens",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:(Venice)_Ca%27_Foscari.jpg",
  },
  {
    slug: "venezia-iuav",
    university: "Università Iuav di Venezia",
    otherNames: ["Iuav University of Venice"],
    photo: veneziaIuavPhoto,
    place: "(Venice) The courtyard and well of the IUAV University of Venice",
    author: "Didier Descouens",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:(Venice)_The_courtyard_and_well_of_the_IUAV_University_of_Venice.jpg",
  },
  {
    slug: "verona",
    university: "Università degli Studi di Verona",
    otherNames: ["University of Verona"],
    photo: veronaPhoto,
    place: "SantaMartaVerona",
    author: "GiovanniCerutti",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:SantaMartaVerona.jpg",
  },
];

const BY_UNIVERSITY = new Map(
  CAMPUS_PHOTOS.flatMap((entry) => [entry.university, ...entry.otherNames].map((name) => [name, entry] as const)),
);

export const campusPhotoFor = (university: string) => BY_UNIVERSITY.get(university);

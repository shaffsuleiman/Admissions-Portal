import json
import tempfile
import unittest
from pathlib import Path

from crawl import (
    calculate_diff,
    load_supplement,
    parse_bologna_second,
    parse_padua_combined,
    parse_pisa,
    parse_polimi_master,
    parse_polito_bachelor,
    parse_sapienza,
)


class CatalogueParserTests(unittest.TestCase):
    def test_bologna_keeps_english_only(self):
        html = """
        <div class="card-list-abstract">
          <div class="item"><h3>Data Science</h3><p>Cod. 1234</p><p>Place of teaching: Bologna, Cesena</p><p>Language: English</p><p>Duration: 2 years</p><div class="card-actions"><a href="/2cycle/data">Go</a></div></div>
          <div class="item"><h3>Storia</h3><p>Cod. 9999</p><p>Place of teaching: Bologna</p><p>Language: Italian</p><p>Duration: 2 years</p><div class="card-actions"><a href="/2cycle/storia">Go</a></div></div>
        </div>
        """
        result = parse_bologna_second(html, "https://example.edu/catalogue")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].official_programme_code, "1234")
        self.assertEqual(result[0].city, "Bologna, Cesena")
        self.assertEqual(result[0].duration_years, 2.0)

    def test_sapienza_dedicated_title_link_and_degree(self):
        html = """
        <li class="corso-card"><div class="corso--header"><h5><a href="/en/course/33519">Data Science</a></h5></div>
        <div class="corso--codice"><span>Programme code</span> 33519</div>
        <div class="corso--tipologia">LM-Data</div><div class="corso--languages"><span>Language</span> ENG</div></li>
        """
        result = parse_sapienza(html, "https://example.edu/home")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].programme_name, "Data Science")
        self.assertEqual(result[0].degree_level, "Master")

    def test_padua_excludes_future_unapproved_programmes(self):
        html = """
        <section><p>Bachelor's Degree Programmes</p><ul>
          <li><a href="/en/corsi-di-laurea/animal-care">Animal care</a></li>
          <li><a href="/en/corsi-di-laurea/future">Future (new programme 2027/2028 - to be approved)</a></li>
        </ul><p>Single-cycle master's degree programmes</p><ul>
          <li><a href="/en/corsi-di-laurea/medicine">Medicine</a></li>
        </ul></section>
        """
        result = parse_padua_combined(html, "https://example.edu/catalogue")
        self.assertEqual([item.degree_level for item in result], ["Bachelor", "Single-cycle"])

    def test_diff_detects_changed_hash(self):
        old = [{"university_slug": "u", "programme_name": "P", "degree_level": "Master", "official_programme_code": None, "academic_year": "2026/27", "content_hash": "a"}]
        new = [{"university_slug": "u", "programme_name": "P", "degree_level": "Master", "official_programme_code": None, "academic_year": "2026/27", "content_hash": "b"}]
        self.assertEqual(calculate_diff(old, new)["summary"], {"added": 0, "changed": 1, "removed": 0})

    def test_polito_uses_language_attribute(self):
        html = """
        <article class="pol-courses--list-item" data-course-languages="IT EN">
          <div class="pol-course-title"><a href="/architecture">Architecture</a></div>
          <div class="pol-course-data--site"><dd>Turin</dd></div>
        </article>
        <article class="pol-courses--list-item" data-course-languages="IT">
          <div class="pol-course-title"><a href="/italian">Italian only</a></div>
        </article>
        """
        result = parse_polito_bachelor(html, "https://example.edu/catalogue")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].programme_name, "Architecture")

    def test_polimi_extracts_title_campuses_and_english(self):
        html = """
        <a class="link" href="/programme/data">
          <div class="localised-title-title"><p>Data Science</p></div>
          <span class="campusName">Milano Leonardo</span><span class="campusName">Cremona</span>
          <li class="info-label--internet"><span>ITA-ENG</span></li>
        </a>
        """
        result = parse_polimi_master(html, "https://example.edu/catalogue")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].city, "Milano Leonardo, Cremona")

    def test_pisa_dedupes_cross_category_programme_by_code(self):
        html = """
        <p><a href="/master/cybersecurity">Master in Cybersecurity</a> (<a href="#">WCY-LM</a>)</p>
        <p><a href="/master/cybersecurity">Master in Cybersecurity</a> (<a href="#">WCY-LM</a>)</p>
        <p><a href="/bachelor/humanities">Bachelor’s Degree – International Humanities</a></p>
        """
        result = parse_pisa(html, "https://example.edu/catalogue")
        self.assertEqual(result[0].official_programme_code, "WCY-LM")
        self.assertEqual(result[-1].degree_level, "Bachelor")

    def test_reviewed_supplement_is_loaded_and_validated(self):
        row = {
            "university_slug": "trento",
            "university_name": "University of Trento",
            "programme_name": "Data Science",
            "city": "Trento",
            "degree_level": "Master",
            "teaching_language": "English",
            "official_programme_code": None,
            "degree_class": None,
            "duration_years": 2.0,
            "source_url": "https://example.edu/data-science",
            "catalogue_source_url": "https://example.edu/catalogue",
            "academic_year": "2026/27",
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "supplement.json"
            path.write_text(json.dumps({"programmes": [row]}), encoding="utf-8")
            result = load_supplement(path)

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].university_slug, "trento")
        self.assertEqual(result[0].programme_name, "Data Science")


if __name__ == "__main__":
    unittest.main()

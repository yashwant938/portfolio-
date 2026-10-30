"""Generate the GitHub Pages homepage using only the Python standard library."""
from html import escape
from pathlib import Path
from hashlib import sha256
from datetime import date
import json

ROOT = Path(__file__).resolve().parents[1]


def link(item):
    return (f'<a href="{escape(item["url"], quote=True)}" target="_blank" '
            f'rel="noopener noreferrer">{escape(item["label"])} ↗</a>')


def media(project):
    visual = project['visual']
    if visual['kind'] == 'screenshot':
        assert (ROOT / 'docs' / visual['path']).is_file()
        return f'''<figure class="screenshot"><a href="{escape(project['links'][0]['url'], quote=True)}" target="_blank" rel="noopener noreferrer"><img src="{visual['path']}" alt="{escape(visual['alt'], quote=True)}" width="1440" height="1000" loading="lazy"></a><figcaption>{escape(visual['caption'])}</figcaption></figure>'''
    if visual['kind'] == 'evidence':
        items = ''.join(f'<a class="evidence-item" href="{escape(item["url"], quote=True)}" target="_blank" rel="noopener noreferrer"><span>{escape(item["label"])} <span class="merged">Merged</span></span><strong>{escape(item["title"])}</strong><code>{escape(item["code"])}</code></a>' for item in visual['items'])
        return f'<div class="evidence-panel"><span class="media-label">MERGED INTO QUALCOMM / ELD</span>{items}<p class="evidence-line">C++ changes. Reproducers. Regression tests.</p></div>'
    steps = ''.join(f'<li class="workflow-step"><code>{i:02d}</code><div><strong>{escape(item["title"])}</strong><span>{escape(item["detail"])}</span></div></li>' for i, item in enumerate(visual['steps'], 1))
    return f'<div class="workflow-panel"><span class="media-label">{escape(visual["label"])}</span><ol>{steps}</ol><p class="evidence-line">{escape(visual["caption"])}</p></div>'


def project_card(project, index):
    highlights = ''.join(f'<li>{escape(item)}</li>' for item in project['highlights'])
    features = ''.join(f'<li>{escape(item)}</li>' for item in project['features'])
    stack = ''.join(f'<li>{escape(item)}</li>' for item in project['stack'])
    prs = ''
    if project.get('contributions'):
        checked = date.fromisoformat(project['verifiedOn'])
        checked_label = f'{checked.day} {checked:%B %Y}'
        prs = f'<div id="contributions"><p class="detail-label">Contribution record · checked {checked_label}</p><ul class="pr-list">'
        for item in project['contributions']:
            prs += f'<li>{link({"label": item["title"], "url": item["url"]})}<span class="pr-status {item["status"].lower()}">{item["status"]}</span></li>'
        prs += '</ul></div>'
    case_study = (ROOT / 'content/eld-case-study.html').read_text(encoding='utf-8').strip() if project['id'] == 'eld' else ''
    return f'''<article class="project reveal" id="{project['id']}" data-category="{' '.join(project['categories'])}">
<div class="project-media">{media(project)}</div>
<div class="project-copy"><div class="project-meta"><span>{escape(project['eyebrow'])}</span><span>{index:02d} / 05</span></div>
<h3>{escape(project['name'])}</h3><p class="project-summary">{escape(project['summary'])}</p>
<ul class="project-highlights">{highlights}</ul><ul class="tech-stack" aria-label="Technologies">{stack}</ul>
<div class="project-links">{' '.join(link(item) for item in project['links'])}</div>
<details class="project-details"><summary>Implementation &amp; evidence</summary><div class="detail-body"><p class="detail-flow">{escape(project['flow'])}</p><ul>{features}</ul>{prs}<p class="detail-note">{escape(project['notes'])}</p></div></details>
</div>{case_study}</article>'''


def build():
    data = json.loads((ROOT / 'content/projects.json').read_text(encoding='utf-8'))
    projects = data['projects']
    assert [p['id'] for p in projects] == ['eld', 'legal-lens', 'real-estate', 'gpt2-summarization', 'cpp-systems']
    template = (ROOT / 'content/index.template.html').read_text(encoding='utf-8')
    replacements = {
        '{{RESUME}}': (ROOT / 'content/resume.html').read_text(encoding='utf-8').strip(),
        '{{PROJECTS}}': '\n'.join(project_card(p, i) for i, p in enumerate(projects, 1)),
        '{{PROJECT_COUNT}}': str(len(projects)),
        '{{MERGED_COUNT}}': str(sum(item['status'] == 'Merged' for item in projects[0]['contributions'])),
        '{{STYLE_REV}}': sha256((ROOT / 'docs/style.css').read_bytes()).hexdigest()[:12],
        '{{SCRIPT_REV}}': sha256((ROOT / 'docs/app.js').read_bytes()).hexdigest()[:12],
    }
    for token, value in replacements.items():
        assert token in template, f'Missing template token: {token}'
        template = template.replace(token, value)
    (ROOT / 'docs/index.html').write_text(template, encoding='utf-8')
    print(f'Built {len(projects)} featured projects. Earlier work is preserved in archive.html.')


if __name__ == '__main__':
    build()

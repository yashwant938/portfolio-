"""Generate the deployable static page. Python standard library only."""
from html import escape
from pathlib import Path
from hashlib import sha256
import json

ROOT = Path(__file__).resolve().parents[1]


def link(item):
    return (f'<a href="{escape(item["url"], quote=True)}" target="_blank" '
            f'rel="noopener noreferrer">{escape(item["label"])} ↗</a>')


def project_card(project, index):
    project_id = project['id']
    visual_path = ROOT / 'content' / 'visuals' / f'{project_id}.html'
    featured = visual_path.exists()
    visual = visual_path.read_text(encoding='utf-8') if featured else (
        f'<div class="project-symbol" aria-hidden="true"><span>{index:02d}</span>'
        f'<span>{escape(project["eyebrow"])}</span></div>')
    features = ''.join(f'<li>{escape(item)}</li>' for item in project['features'])
    links = ' '.join(link(item) for item in project['links'])
    categories = ' '.join(project['categories'])
    tags = ' · '.join(project['stack'])
    return f'''<article class="project{' compact' if not featured else ''}" id="{project_id}" data-category="{categories}">
{visual}
<div class="project-meta"><span>{escape(project['eyebrow'])}</span><span>{index:02d}</span></div>
<h3>{escape(project['name'])}</h3>
<p>{escape(project['summary'])}</p>
<p class="project-status">{escape(project['status'])}</p>
<details class="project-details"><summary>Inside the project</summary>
<p class="detail-label">How it works</p><p class="detail-flow">{escape(project['flow'])}</p>
<ul>{features}</ul><p class="detail-note">{escape(project['notes'])}</p>
</details>
<div class="project-end"><span>{escape(tags)}</span><div class="project-links">{links}</div></div>
</article>'''


def contribution_card(group):
    items = []
    for item in group['items']:
        status = item['status']
        items.append(f'''<li><div><a href="{escape(item['url'], quote=True)}" target="_blank" rel="noopener noreferrer">{escape(item['title'])} ↗</a><span class="pr-status {status.lower()}">{status}</span></div><p>{escape(item['detail'])}</p></li>''')
    return f'''<article class="contribution-card"><span class="eyebrow">{escape(group['eyebrow'])}</span><h3>{escape(group['name'])}</h3><p>{escape(group['summary'])}</p><ul class="contribution-list">{''.join(items)}</ul><p class="contribution-note">{escape(group['note'])}</p></article>'''


def build():
    data = json.loads((ROOT / 'content' / 'projects.json').read_text(encoding='utf-8'))
    projects = data['projects']
    ids = [project['id'] for project in projects]
    assert len(ids) == len(set(ids)), 'Project IDs must be unique'
    assert all(project['categories'] for project in projects)
    template = (ROOT / 'content' / 'index.template.html').read_text(encoding='utf-8')
    replacements = {
        '{{PROJECTS}}': '\n'.join(project_card(p, i) for i, p in enumerate(projects, 1)),
        '{{PROJECT_COUNT}}': str(len(projects)),
        '{{CONTRIBUTIONS}}': '\n'.join(contribution_card(g) for g in data['contributions']),
        '{{ARCHIVE}}': '\n'.join(link(item) for item in data['archive']),
        '{{STYLE_REV}}': sha256((ROOT / 'docs/style.css').read_bytes()).hexdigest()[:12],
        '{{SCRIPT_REV}}': sha256((ROOT / 'docs/app.js').read_bytes()).hexdigest()[:12],
    }
    for token, value in replacements.items():
        assert token in template, f'Missing template token: {token}'
        template = template.replace(token, value)
    (ROOT / 'docs' / 'index.html').write_text(template, encoding='utf-8')
    print(f'Built {len(projects)} project cards and {len(data["contributions"])} contribution groups.')


if __name__ == '__main__':
    build()

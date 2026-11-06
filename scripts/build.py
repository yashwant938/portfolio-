"""Generate the GitHub Pages homepage using only the Python standard library."""
from html import escape
from pathlib import Path
from hashlib import sha256
from datetime import date
import json

ROOT = Path(__file__).resolve().parents[1]


def link(item):
    return (f'<a class="project-link" href="{escape(item["url"], quote=True)}" target="_blank" '
            f'rel="noopener noreferrer">{escape(item["label"])} <span aria-hidden="true">↗</span></a>')


def media(project):
    visual = project['visual']
    if visual['kind'] == 'screenshot':
        assert (ROOT / 'docs' / visual['path']).is_file()
        return (
            f'<figure class="screenshot">'
            f'<div class="window-bar" aria-hidden="true">'
            f'<span class="window-dots"><i></i><i></i><i></i></span>'
            f'<span class="window-title">{escape(project["name"])} · Live Workspace</span>'
            f'</div>'
            f'<a href="{escape(project["links"][0]["url"], quote=True)}" target="_blank" rel="noopener noreferrer">'
            f'<img src="{visual["path"]}" alt="{escape(visual["alt"], quote=True)}" width="1440" height="1000" loading="lazy">'
            f'</a>'
            f'<figcaption>{escape(visual["caption"])}</figcaption>'
            f'</figure>'
        )
    if visual['kind'] == 'evidence':
        items = ''.join(
            f'<a class="evidence-item" href="{escape(item["url"], quote=True)}" target="_blank" rel="noopener noreferrer">'
            f'<div class="evidence-top"><span class="evidence-pr">{escape(item["label"])}</span><span class="merged">Merged</span></div>'
            f'<strong>{escape(item["title"])}</strong>'
            f'<code>{escape(item["code"])}</code>'
            f'</a>'
            for item in visual['items']
        )
        return (
            f'<aside class="evidence-panel" aria-label="Merged Qualcomm ELD pull requests">'
            f'<div class="spec-header"><span class="media-label">qualcomm/eld · upstream patches</span><span class="spec-tag">C++ / LLVM</span></div>'
            f'<div class="evidence-list">{items}</div>'
            f'<p class="evidence-line">Targets: x86-64 · Hexagon · ARM · AArch64 · RV32 · RV64</p>'
            f'</aside>'
        )
    flow_nodes = [part.strip() for part in project['flow'].split('→')]
    flow_html = '<span class="flow-arrow" aria-hidden="true">→</span>'.join(
        f'<span class="flow-node">{escape(node)}</span>' for node in flow_nodes
    )
    steps = ''.join(
        f'<li class="workflow-step">'
        f'<strong>{escape(item["title"])}</strong>'
        f'<span>{escape(item["detail"])}</span>'
        f'</li>'
        for item in visual['steps']
    )
    return (
        f'<aside class="workflow-panel" aria-label="{escape(visual["label"])} specification">'
        f'<div class="spec-header"><span class="media-label">{escape(visual["label"])}</span><span class="spec-tag">Architecture</span></div>'
        f'<div class="flow-schematic" aria-label="Data flow">{flow_html}</div>'
        f'<ol>{steps}</ol>'
        f'<p class="evidence-line">{escape(visual["caption"])}</p>'
        f'</aside>'
    )


def project_card(project, index, total):
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
<div class="project-copy">
  <div class="project-meta"><span class="project-index">{index:02d} / {total:02d}</span><span class="project-eyebrow">{escape(project['eyebrow'])}</span></div>
  <h3>{escape(project['name'])}</h3>
  <p class="project-summary">{escape(project['summary'])}</p>
  <ul class="project-highlights">{highlights}</ul>
  <div class="project-footer-bar">
    <ul class="tech-stack" aria-label="Technologies">{stack}</ul>
    <div class="project-links">{' '.join(link(item) for item in project['links'])}</div>
  </div>
  <details class="project-details">
    <summary>Implementation &amp; evidence</summary>
    <div class="detail-body">
      <p class="detail-flow"><span>Pipeline:</span> {escape(project['flow'])}</p>
      <ul>{features}</ul>
      {prs}
      <p class="detail-note">{escape(project['notes'])}</p>
    </div>
  </details>
</div>
<div class="project-media">{media(project)}</div>
{case_study}</article>'''


def build():
    data = json.loads((ROOT / 'content/projects.json').read_text(encoding='utf-8'))
    projects = data['projects']
    assert projects and projects[0]['id'] == 'eld'
    assert len({p['id'] for p in projects}) == len(projects), 'Project IDs must be unique'
    template = (ROOT / 'content/index.template.html').read_text(encoding='utf-8')
    replacements = {
        '{{RESUME}}': (ROOT / 'content/resume.html').read_text(encoding='utf-8').strip(),
        '{{PROJECTS}}': '\n'.join(project_card(p, i, len(projects)) for i, p in enumerate(projects, 1)),
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

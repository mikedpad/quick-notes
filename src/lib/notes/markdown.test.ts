// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderMarkdown, toPlainText } from '$lib/notes/markdown';

describe('renderMarkdown', () => {
  it('returns nothing for empty or whitespace-only input', () => {
    expect(renderMarkdown('')).toBe('');
    expect(renderMarkdown('   \n\n  ')).toBe('');
  });

  it('renders paragraphs', () => {
    const html = renderMarkdown('First para.\n\nSecond para.');

    expect(html).toContain('<p>First para.</p>');
    expect(html).toContain('<p>Second para.</p>');
  });

  it('treats a single newline as a line break', () => {
    // A notes app, not a typesetting system: one Enter means one new line.
    expect(renderMarkdown('Line one\nLine two')).toContain('<br>');
  });

  it('renders emphasis, strong and strikethrough', () => {
    const html = renderMarkdown('*em* **strong** ~~struck~~');

    expect(html).toContain('<em>em</em>');
    expect(html).toContain('<strong>strong</strong>');
    expect(html).toContain('<del>struck</del>');
  });

  it('renders headings', () => {
    expect(renderMarkdown('# Title')).toContain('<h1>Title</h1>');
    expect(renderMarkdown('### Smaller')).toContain('<h3>Smaller</h3>');
  });

  it('renders unordered and ordered lists', () => {
    expect(renderMarkdown('- one\n- two')).toContain('<ul>');
    expect(renderMarkdown('1. one\n2. two')).toContain('<ol>');
  });

  it('renders inline code and fenced code blocks', () => {
    expect(renderMarkdown('`inline`')).toContain('<code>inline</code>');

    const fenced = renderMarkdown('```\nconst x = 1;\n```');
    expect(fenced).toContain('<pre>');
    expect(fenced).toContain('const x = 1;');
  });

  it('renders blockquotes and horizontal rules', () => {
    expect(renderMarkdown('> quoted')).toContain('<blockquote>');
    expect(renderMarkdown('---')).toContain('<hr>');
  });

  it('opens links in a new tab without handing over the opener', () => {
    const html = renderMarkdown('[example](https://example.com)');

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  describe('sanitising', () => {
    it('strips script tags', () => {
      const html = renderMarkdown('Hello <script>alert("xss")</script> world');

      expect(html).not.toContain('<script');
      expect(html).not.toContain('alert');
    });

    it('strips inline event handlers', () => {
      const html = renderMarkdown('<p onclick="alert(1)">click me</p>');

      expect(html).not.toContain('onclick');
      expect(html).toContain('click me');
    });

    it('strips javascript: URLs', () => {
      const html = renderMarkdown('[click](javascript:alert(1))');

      expect(html).not.toContain('javascript:');
    });

    it('strips images — notes are text only', () => {
      const html = renderMarkdown('![alt](https://example.com/tracker.png)');

      expect(html).not.toContain('<img');
      expect(html).not.toContain('example.com');
    });

    it('strips iframes and embedded objects', () => {
      const html = renderMarkdown('<iframe src="https://evil.example"></iframe>');

      expect(html).not.toContain('<iframe');
    });

    it('strips style tags and svg payloads', () => {
      expect(renderMarkdown('<style>body{display:none}</style>')).not.toContain('<style');
      expect(renderMarkdown('<svg onload="alert(1)"></svg>')).not.toContain('<svg');
    });

    it('leaves ordinary text with angle brackets readable', () => {
      const html = renderMarkdown('Use a < b to compare');

      expect(html).toContain('&lt;');
    });
  });
});

describe('toPlainText', () => {
  it('strips heading markers', () => {
    expect(toPlainText('# Title')).toBe('Title');
  });

  it('keeps link text and drops the URL', () => {
    expect(toPlainText('See [the docs](https://example.com) for more')).toBe(
      'See the docs for more',
    );
  });

  it('strips emphasis markers', () => {
    expect(toPlainText('**bold** and *italic* and ~~struck~~')).toBe('bold and italic and struck');
  });

  it('strips list markers', () => {
    expect(toPlainText('- one\n- two')).toBe('one two');
    expect(toPlainText('1. one\n2. two')).toBe('one two');
  });

  it('removes fenced code blocks entirely', () => {
    expect(toPlainText('Before\n```\nsecret()\n```\nAfter')).toBe('Before After');
  });

  it('unwraps inline code', () => {
    expect(toPlainText('Run `pnpm test` now')).toBe('Run pnpm test now');
  });

  it('drops blockquote markers and images', () => {
    expect(toPlainText('> quoted')).toBe('quoted');
    expect(toPlainText('![alt](img.png) caption')).toBe('caption');
  });

  it('collapses whitespace to a single line', () => {
    expect(toPlainText('One\n\n\nTwo   \t Three')).toBe('One Two Three');
  });

  it('returns an empty string for empty input', () => {
    expect(toPlainText('')).toBe('');
  });
});

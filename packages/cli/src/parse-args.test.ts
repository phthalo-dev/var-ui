import { describe, expect, it } from 'vite-plus/test';
import { parseCliArgs } from './parse-args';

describe('parseCliArgs', () => {
  it('returns help when there are no positionals', () => {
    expect(parseCliArgs([])).toEqual({ command: 'help' });
  });

  it('returns help for --help and -h', () => {
    expect(parseCliArgs(['--help'])).toEqual({ command: 'help' });
    expect(parseCliArgs(['-h'])).toEqual({ command: 'help' });
    expect(parseCliArgs(['component', '--help'])).toEqual({ command: 'help' });
  });

  it('parses component --list and -l', () => {
    expect(parseCliArgs(['component', '--list'])).toEqual({
      command: 'component',
      list: true,
      json: false,
      allProps: false,
    });
    expect(parseCliArgs(['component', '-l'])).toEqual({
      command: 'component',
      list: true,
      json: false,
      allProps: false,
    });
  });

  it('parses component with a query positional', () => {
    expect(parseCliArgs(['component', 'Button'])).toEqual({
      command: 'component',
      list: false,
      query: 'Button',
      json: false,
      allProps: false,
    });
  });

  it('parses component --json and --all-props', () => {
    expect(parseCliArgs(['component', 'Button', '--json'])).toEqual({
      command: 'component',
      list: false,
      query: 'Button',
      json: true,
      allProps: false,
    });
    expect(parseCliArgs(['component', 'Button', '--all-props'])).toEqual({
      command: 'component',
      list: false,
      query: 'Button',
      json: false,
      allProps: true,
    });
  });

  it('parses docs --list and docs query', () => {
    expect(parseCliArgs(['docs', '--list'])).toEqual({
      command: 'docs',
      list: true,
      json: false,
    });
    expect(parseCliArgs(['docs', 'getting-started'])).toEqual({
      command: 'docs',
      list: false,
      query: 'getting-started',
      json: false,
    });
  });

  it('joins remaining search positionals as the query', () => {
    expect(parseCliArgs(['search', 'getting', 'started'])).toEqual({
      command: 'search',
      query: 'getting started',
      json: false,
    });
    expect(parseCliArgs(['search', '--json', 'button'])).toEqual({
      command: 'search',
      query: 'button',
      json: true,
    });
  });

  it('parses init', () => {
    expect(parseCliArgs(['init'])).toEqual({ command: 'init' });
  });

  it('returns unknown with the original argv', () => {
    expect(parseCliArgs(['nope'])).toEqual({ command: 'unknown', argv: ['nope'] });
    expect(parseCliArgs(['generate', '--write'])).toEqual({
      command: 'unknown',
      argv: ['generate', '--write'],
    });
  });
});

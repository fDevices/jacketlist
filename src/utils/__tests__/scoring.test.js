import { editorialLabels } from '@/utils/scoring';

function makeBook(overrides) {
  return {
    new_this_week: false,
    score: 3,
    weeks_on_list: 2,
    ...overrides,
  };
}

describe('editorialLabels', () => {
  it('returns empty array for a plain book', () => {
    expect(editorialLabels(makeBook({ score: 3, weeks_on_list: 2 }))).toEqual([]);
  });

  it('returns New This Week when new_this_week is true', () => {
    expect(editorialLabels(makeBook({ new_this_week: true, score: 3, weeks_on_list: 1 }))).toContain('New This Week');
  });

  it('returns Top Consensus when score is 6', () => {
    expect(editorialLabels(makeBook({ score: 6 }))).toContain('Top Consensus');
  });

  it('returns Top Consensus when score is 7', () => {
    expect(editorialLabels(makeBook({ score: 7 }))).toContain('Top Consensus');
  });

  it('does not return Top Consensus when score is 5', () => {
    expect(editorialLabels(makeBook({ score: 5 }))).not.toContain('Top Consensus');
  });

  it('returns Long Running when weeks_on_list is 8', () => {
    expect(editorialLabels(makeBook({ weeks_on_list: 8 }))).toContain('Long Running');
  });

  it('returns Long Running when weeks_on_list is 12', () => {
    expect(editorialLabels(makeBook({ weeks_on_list: 12 }))).toContain('Long Running');
  });

  it('does not return Long Running when weeks_on_list is 7', () => {
    expect(editorialLabels(makeBook({ weeks_on_list: 7 }))).not.toContain('Long Running');
  });

  it('returns Rising Fast for weeks 2-4 with score >= 5 and not new', () => {
    expect(editorialLabels(makeBook({ new_this_week: false, score: 5, weeks_on_list: 3 }))).toContain('Rising Fast');
  });

  it('does not return Rising Fast when new_this_week is true', () => {
    expect(editorialLabels(makeBook({ new_this_week: true, score: 5, weeks_on_list: 1 }))).not.toContain('Rising Fast');
  });

  it('does not return Rising Fast when score is below 5', () => {
    expect(editorialLabels(makeBook({ new_this_week: false, score: 4, weeks_on_list: 3 }))).not.toContain('Rising Fast');
  });

  it('does not return Rising Fast when weeks_on_list is outside 2-4', () => {
    expect(editorialLabels(makeBook({ new_this_week: false, score: 5, weeks_on_list: 5 }))).not.toContain('Rising Fast');
  });

  it('can return multiple labels', () => {
    const labels = editorialLabels(makeBook({ new_this_week: false, score: 6, weeks_on_list: 3 }));
    expect(labels).toContain('Top Consensus');
    expect(labels).toContain('Rising Fast');
  });
});

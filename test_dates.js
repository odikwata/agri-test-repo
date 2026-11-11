const cycle = { plantedDate: '2026-07-29T00:00:00.000Z' };
const program = { growthStageList: [{ durationInDays: 14, stageName: 'Stage 1' }, { durationInDays: 20, stageName: 'Stage 2' }] };

const plantedDate = new Date(cycle.plantedDate);
const today = new Date();
today.setHours(0, 0, 0, 0);

let currentStartDate = new Date(plantedDate);

const res = program.growthStageList.map(stage => {
  const startDate = new Date(currentStartDate);
  const endDate = new Date(currentStartDate);
  endDate.setDate(endDate.getDate() + stage.durationInDays);

  let status = 'upcoming';

  if (today > endDate) {
    status = 'completed';
  } else if (today >= startDate && today <= endDate) {
    status = 'current';
  } else {
    status = 'upcoming';
  }

  currentStartDate = endDate;

  return {
    ...stage,
    startDate,
    endDate,
    status
  };
});

console.log(JSON.stringify(res, null, 2));

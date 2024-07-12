const mockData = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: { amount: 200.0, currency: "EUR" },
  },
  {
    date: "2016-01-06",
    user_id: 2,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 300.0, currency: "EUR" },
  },
  {
    date: "2016-01-06",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 30000, currency: "EUR" },
  },
  {
    date: "2016-01-07",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 1000.0, currency: "EUR" },
  },
  {
    date: "2016-01-07",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 100.0, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 100.0, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 2,
    user_type: "juridical",
    type: "cash_in",
    operation: { amount: 1000000.0, currency: "EUR" },
  },
  {
    date: "2016-01-10",
    user_id: 3,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 1000.0, currency: "EUR" },
  },
  {
    date: "2016-02-15",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 300.0, currency: "EUR" },
  },
];

function isWeekPassed(date1, date2) {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  const diffInMilliseconds = Math.abs(secondDate - firstDate);
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

  return diffInDays >= 7;
}

const calculateCommissionByUser = (data) => {
  const discountarr = [];

  for (let i = 0; i < data?.length; i++) {
    const transaction = data[i];

    const {
      type,
      user_type,
      user_id,
      date,
      operation: { amount },
    } = transaction;

    if (type === "cash_in") {
      const commission = (amount * 0.03) / 100;
      discountarr.push({
        ...transaction,
        commission: (commission >= 5 ? 5 : commission).toFixed(2),
      });
    }

    if (type === "cash_out") {
      if (user_type === "natural") {
        const isMoreThan1000 = amount > 1000;
        const alreadyGivenDisc = discountarr?.find(
          (tr) => tr?.user_id === user_id && tr?.free1000,
        );

        const giveCom = isWeekPassed(alreadyGivenDisc?.date ?? 0, date);

        console.log(giveCom, "giveCom", transaction);

        const excessAmount = giveCom
          ? isMoreThan1000
            ? amount - 1000
            : 0
          : amount;
        const commission = (excessAmount * 0.3) / 100;
        discountarr.push({
          ...transaction,
          free1000: giveCom,
          commission: commission.toFixed(2),
        });
      } else {
        const commission = (amount * 0.3) / 100;
        discountarr.push({
          ...transaction,
          commission: (commission >= 0.5 ? commission : 0.5).toFixed(2),
        });
      }
    }
  }
  return discountarr.map((trr) => trr.commission);
};

console.log(calculateCommissionByUser(mockData));

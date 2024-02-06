export const custom = {
  ElasticOut: function (amount: number) {
    if (amount === 0) {
      return 0;
    }
    if (amount === 1) {
      return 1;
    }
    return (
      Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1
    );
  },
};

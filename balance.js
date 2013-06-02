var in_weight_min,
    in_weight_max,
    coeff
  ;

exports = module.exports = {

  reset: function() {
    this.ready = false;

    in_weight_min = null;
    in_weight_max = null;
  },

  /**
   * Calibrate balance and return success
   *
   * @param w        weight expected in grams for actual input
   * @param inw      arduino input weight actual
   * @param inwmin   arduino input weight min, where weight equals 0
   * @param inwmax   arduino input weight max
   * @return bool
   */
  calibrate: function(w, inw, inwmin, inwmax) {

    this.ready = true;

    // Defines globals to calculate weight
    in_weight_min = inwmin;
    in_weight_max = inwmax;

    coeff = Math.round(parseFloat(w) / (parseFloat(inw) - parseFloat(in_weight_min)));

    return true;
  },

  tare: function(inw) {
    in_weight_min = inw;
  },

  /**
   * @param inw arduino input weight actual
   * @return int
   */
  getWeight: function(inw) {

    if (!this.ready) {
      return false;
    }

    return {
      value:  parseInt((inw - in_weight_min) * coeff),
      date:   new Date(),
      in_min: inw <= in_weight_min,
      in_max: inw >= in_weight_max
    };
  },

  ready: false

};
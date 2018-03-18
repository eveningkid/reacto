import wrap from 'word-wrap';

/**
 * If you're a contributor, feel free to add your own quote below.
 *
 * Inspire developers out there.
 * Remember why you're doing all this,
 * Remember what got you started,
 * And what keeps you doing it.
 *
 * https://media.giphy.com/media/Ld0P4AdeSDjoY/giphy.gif
 */

export default {
  CHARS_BY_LINE: 60,
  getRandom() {
    const element = this.all[Math.round(Math.random() * (this.all.length - 1))];
    const wrappedText = wrap(element.quote, { indent: '', width: this.CHARS_BY_LINE });
    return wrappedText;
  },
  all: [
    {
      author: 'Arnaud Dellinger',
      quote: 'What I love about programming is how much it pushes us to learn, think, and surpass ourselves, beyond everything we could have ever imagined.',
    },
  ],
};

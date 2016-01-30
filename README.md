# FontRemap
A simple font utility which facilitates the creation of auxiliary font files by re-mapping character codes to arbitrary glyphs. Pertinent strings can then be ‘enciphered’ such that they are only legible under the generated font and vacuous otherwise. This technique can be employed, for instance, to prohibit copying displayed text onto the clipboard.

##Installation

git clone https://github.com/ciprian-dragomir/FontRemap.git

##Usage

node font-remap [options]

Typically, you would use font-remap in the following way:
1. Generate a new font file based on a random mapping (the mapping is also produced and saved):

node font-remap -r <original_font.ttf>

2. Use the created font-mapping to encode strings whose character representation is to be concealed:

node font-remap -s 'String to encode' -m <font-map.json>

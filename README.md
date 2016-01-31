# FontRemap
A simple font utility which facilitates the creation of auxiliary font files by re-mapping character codes to arbitrary glyphs. Pertinent strings can then be ‘enciphered’ such that they are only legible under the generated font and vacuous otherwise. This technique can be employed, for instance, to prohibit copying displayed text onto the clipboard.

##Installation

```bash
git clone https://github.com/ciprian-dragomir/FontRemap.git
```

Then cd to the project directory

```bash
cd FontMap
```
and install npm package dependencies:

```bash
npm install
```

Finally, clone [fonttools](https://github.com/behdad/fonttools) utility:

```bash
git clone https://github.com/behdad/fonttools.git
```

##Usage

```bash
node font-remap [options]
```

Typically, you would use font-remap in the following way:

1. Generate a new font file with a random character to glyph mapping (the mapping is also produced and saved):

```bash
node font-remap -r <original_font.ttf>
```

2. Use the created font-mapping to encode strings whose character representation is to be concealed:

```bash
node font-remap -s 'String to encode' -m <font-map.json>
```

##Dependecies
FontRemap uses [fonttools](https://github.com/behdad/fonttools), a tool written in python which extracts character tables from font files into more manageable xml files (.ttx extension), but is also able to reconstruct a true type font from the xml representation. FontRemap uses the xml structured document as an intermediate format.
The fonttools package also requires python3 to run.

##Notes
Due to its reliance on fonttools, FontRemap inherits all its limitations. 
Additionally, the FontRemap only works with font files which include cmap type 4 or 12 tables at this time.


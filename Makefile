EXT_NAME=wikipedia-helper

all: clean pages package

pages: 
	jade jade/*.jade -Po .

clean:
	rm -rf *~
	rm -f $(EXT_NAME).zip

package: manifest.json
	zip -r $(EXT_NAME) * -x jade/ jade/* Makefile $(EXT_NAME).zip
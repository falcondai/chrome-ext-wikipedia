EXT_NAME=wikipedia-plus
TEMPLATES=jade/*.jade

all: clean pages package

pages: 
	jade $(TEMPLATES) -Po .

watch:
	jade $(TEMPLATES) -wPo .

clean:
	rm -rf *~
	rm -f $(EXT_NAME).zip

package: manifest.json
	zip -r $(EXT_NAME) * -x graphics/ graphics/* jade/ jade/* Makefile $(EXT_NAME).zip
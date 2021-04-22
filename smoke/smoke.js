import Jasmine from 'jasmine'

const jasmine = new Jasmine();

jasmine.loadConfigFile('jasmine.smoke.json');
jasmine.execute();

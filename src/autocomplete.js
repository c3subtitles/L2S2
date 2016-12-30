/* eslint-disable */
(function() {
    var timesTyped = {};
    var completions = {};
    var isCompleted = {};
    var caseSensitiveCompletion = true;

    var addCompletion = function(word) {
        if (!caseSensitiveCompletion) word = word.toLowerCase();
        if (word.length >= 5) {
            for (var i = word.length - 1; i >= 2; i--) {
                var prefix = word.substring(0, i);
                var rest = word.substring(i);
                completions[prefix] = rest;
                if (isCompleted[prefix]) break;
            }
            isCompleted[word] = true;
        }
    };

    // grep -v '[A-Z]' < 999-common-words.txt | sort | grep ... | sed -e 's/\(...\)\(.*\)/\1\2 \1/' | uniq -c -f 1 | grep '^ *1 ' | grep -o '[a-z][a-z][a-z][a-z][a-z]*' > autocomplete-words.txt
    var enAutocompleteWords = [
        'able', 'across', 'adjective', 'afraid', 'after', 'agreed', 'ahead',
        'almost', 'already', 'also', 'although', 'always', 'angle', 'animal',
        'another', 'answer', 'around', 'arrived', 'away', 'baby', 'back',
        'ball', 'bank', 'base', 'been', 'before', 'behind', 'being', 'bill',
        'birds', 'black', 'blue', 'body', 'bones', 'book', 'born', 'branches',
        'break', 'burning', 'business', 'call', 'came', 'case', 'cells',
        'certain', 'check', 'choose', 'church', 'circle', 'city', 'class',
        'climbed', 'coast', 'copy', 'cost', 'cotton', 'covered', 'cows',
        'create', 'cried', 'current', 'dance', 'dark', 'deep', 'developed',
        'dictionary', 'died', 'doctor', 'dollars', 'door', 'down', 'dress',
        'drive', 'drop', 'during', 'each', 'edge', 'effect', 'eggs', 'eight',
        'either', 'else', 'energy', 'engine', 'enjoy', 'enough', 'especially',
        'exercise', 'fall', 'fast', 'father', 'fear', 'field', 'filled',
        'fish', 'five', 'flat', 'follow', 'fraction', 'friends', 'fruit',
        'full', 'game', 'garden', 'gave', 'general', 'girl', 'give', 'glass',
        'gold', 'gone', 'good', 'government', 'grass', 'guess', 'hair', 'halt',
        'hand', 'hard', 'have', 'high', 'hill', 'home', 'hope', 'horse',
        'huge', 'human', 'idea', 'important', 'information', 'iron', 'island',
        'joined', 'jumped', 'just', 'keep', 'kept', 'killed', 'knew', 'lady',
        'lake', 'large', 'last', 'later', 'laughed', 'left', 'legs', 'length',
        'less', 'level', 'light', 'like', 'line', 'little', 'live', 'located',
        'long', 'look', 'lost', 'loud', 'love', 'machine', 'made', 'main',
        'major', 'make', 'meet', 'melody', 'members', 'middle', 'might',
        'miss', 'modern', 'molecules', 'moment', 'moon', 'most', 'mother',
        'much', 'name', 'near', 'necessary', 'need', 'never', 'next', 'night',
        'nose', 'noun', 'object', 'observe', 'ocean', 'often', 'once', 'only',
        'open', 'opposite', 'order', 'other', 'over', 'oxygen', 'page',
        'paper', 'pattern', 'people', 'phrase', 'piece', 'please', 'plural',
        'poem', 'point', 'pole', 'poor', 'pounds', 'power', 'practice',
        'printed', 'pulled', 'pushed', 'questions', 'race', 'radio', 'rather',
        'region', 'return', 'rhythm', 'rich', 'ride', 'right', 'ring', 'rise',
        'river', 'road', 'rock', 'rolled', 'rope', 'rose', 'round', 'rule',
        'safe', 'same', 'sand', 'save', 'scale', 'school', 'score', 'sell',
        'separate', 'serve', 'ship', 'side', 'silent', 'sister', 'size',
        'skin', 'slowly', 'small', 'smell', 'smiled', 'snow', 'soft', 'soil',
        'soon', 'space', 'spot', 'square', 'such', 'suddenly', 'suffix',
        'swim', 'syllables', 'symbols', 'system', 'table', 'tail', 'take',
        'tell', 'temperature', 'terms', 'test', 'thus', 'tied', 'time', 'tiny',
        'today', 'together', 'told', 'tone', 'total', 'touch', 'tree',
        'trouble', 'tube', 'turn', 'type', 'uncle', 'unit', 'until', 'upon',
        'usually', 'various', 'view', 'village', 'visit', 'voice', 'vowel',
        'wait', 'want', 'waves', 'week', 'weight', 'well', 'went', 'were',
        'what', 'wide', 'wife', 'wire', 'wish', 'wood', 'yard', 'year',
        'yellow',

    // grep -v '[A-Z]' < 3000-common-words.txt | sort | grep ... | sed -e 's/\(...\)\(.*\)/\1\2 \1/' | uniq -c -f 1 | grep '^ *1 ' | grep -o '[a-z][a-z][a-z][a-z][a-z]*' > autocomplete-words-2.txt
        'abandon', 'ability', 'able', 'abroad', 'abuse', 'academic', 'acid',
        'acknowledge', 'acquire', 'across', 'adapt', 'adequate', 'adult',
        'afraid', 'aggressive', 'ahead', 'album', 'alcohol', 'alive', 'almost',
        'already', 'also', 'always', 'amazing', 'ancient', 'animal', 'another',
        'answer', 'anticipate', 'anxiety', 'architect', 'area', 'arise',
        'around', 'aside', 'asleep', 'aspect', 'atmosphere', 'audience',
        'available', 'average', 'avoid', 'awful', 'baby', 'bake', 'beer',
        'before', 'being', 'beyond', 'bike', 'bind', 'biological', 'blind',
        'blue', 'body', 'boss', 'boundary', 'bowl', 'brush', 'buck', 'budget',
        'bullet', 'bunch', 'cake', 'cause', 'ceiling', 'church', 'cigarette',
        'code', 'coffee', 'cognitive', 'cost', 'cotton', 'crucial', 'cycle',
        'daily', 'damage', 'daughter', 'degree', 'deny', 'derive', 'dialogue',
        'dimension', 'door', 'dozen', 'drop', 'drug', 'during', 'dust', 'duty',
        'mail', 'each', 'eager', 'edge', 'eight', 'either', 'elderly',
        'embrace', 'emission', 'enable', 'enforcement', 'enhance', 'enjoy',
        'ensure', 'episode', 'error', 'escape', 'especially', 'evidence',
        'fabric', 'fade', 'fault', 'federal', 'fellow', 'female', 'fence',
        'fiber', 'fiction', 'field', 'five', 'flight', 'focus', 'fuel',
        'future', 'gain', 'game', 'gang', 'gaze', 'gear', 'gesture', 'ghost',
        'giant', 'goal', 'good', 'hair', 'have', 'heel', 'height', 'hide',
        'hill', 'hire', 'hope', 'huge', 'hurt', 'husband', 'hypothesis',
        'ignore', 'ingredient', 'injury', 'inquiry', 'iron', 'island', 'issue',
        'item', 'jacket', 'jail', 'joke', 'juice', 'jump', 'junior', 'jury',
        'keep', 'kick', 'kiss', 'kitchen', 'knee', 'knife', 'lack', 'lady',
        'lake', 'last', 'left', 'lemon', 'length', 'level', 'license', 'light',
        'loud', 'machine', 'magazine', 'mechanism', 'middle', 'might', 'much',
        'multiple', 'murder', 'mutual', 'myth', 'naked', 'name', 'need',
        'next', 'nice', 'night', 'nine', 'nobody', 'noise', 'nomination',
        'nose', 'novel', 'nuclear', 'nurse', 'obligation', 'obtain', 'ocean',
        'often', 'okay', 'once', 'ongoing', 'onion', 'onto', 'opinion',
        'option', 'orange', 'ought', 'page', 'paper', 'pause', 'peer',
        'penalty', 'people', 'pepper', 'phase', 'phenomenon', 'philosophy',
        'phrase', 'piano', 'pipe', 'pitch', 'plot', 'plus', 'pocket', 'point',
        'poverty', 'pull', 'punishment', 'push', 'question', 'quote',
        'reinforce', 'reject', 'rhythm', 'rifle', 'right', 'ring', 'river',
        'road', 'rock', 'romantic', 'rope', 'rose', 'rule', 'rural', 'rush',
        'sacred', 'sake', 'sauce', 'segment', 'seize', 'separate', 'sequence',
        'session', 'shrug', 'shut', 'sick', 'side', 'sister', 'size', 'slave',
        'sleep', 'smell', 'smile', 'snap', 'snow', 'called', 'soil', 'soon',
        'sophisticated', 'space', 'split', 'style', 'system', 'tactic', 'tail',
        'take', 'tank', 'target', 'text', 'thus', 'ticket', 'tight', 'time',
        'tiny', 'tissue', 'title', 'tobacco', 'today', 'together', 'toss',
        'tube', 'tunnel', 'turn', 'ugly', 'unable', 'uncle', 'unfortunately',
        'unknown', 'until', 'unusual', 'upon', 'upper', 'urban', 'urge',
        'utility', 'vacation', 'vast', 'vegetable', 'vehicle', 'venture',
        'vessel', 'veteran', 'video', 'village', 'vital', 'voice',
        'vulnerable', 'wage', 'wait', 'wake', 'wave', 'wedding', 'wife',
        'wipe', 'wire', 'woman', 'wrap', 'wrong', 'yard', 'yield', 'zone',

    // from https://en.wikipedia.org/wiki/Most_common_words_in_English
        'time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world',
        'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 'work',
        'week', 'case', 'point', 'government', 'company', 'number', 'group',
        'problem', 'fact', 'be', 'have', 'do', 'say', 'get', 'make', 'go',
        'know', 'take', 'see', 'come', 'think', 'look', 'want', 'give', 'use',
        'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call',
        'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own',
        'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large',
        'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same',
        'able', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
        'up', 'about', 'into', 'over', 'after', 'beneath', 'under', 'above',
        'the', 'and', 'a', 'that', 'I', 'it', 'not', 'he', 'as', 'you', 'this',
        'but', 'his', 'they', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
        'all', 'would', 'there', 'their',

    // hand-picked words: software
        'application', 'server', 'network', 'Ethernet',
        'architecture', 'request', 'protocol', 'abstract', 'virtual',
        'container', 'virtualization', 'operating', 'system', 'instruction',
        'building', 'build', 'continuous', 'integration', 'interface',
        'module', 'assembly', 'package', 'deploy', 'deployment', 'service',
        'optimize', 'optimization', 'understand', 'testing', 'compiler',
        'latency' ,'performance', 'incremental', 'throughput', 'capacity',
        'database', 'infrastructure',
        'Internet', 'telecommunications', 'provider', 'platform',

    // hand-picked words: computer security
        'computer', 'software', 'hardware', 'exploit', 'vulnerability',
        'firmware', 'malware', 'attack', 'intrusion', 'protection', 'detection',
        'embedded', 'device', 'peripheral', 'implementation', 'implement',
        'disclosure', 'publication', 'research', 'announce', 'announcement',
        'communicate', 'communication', 'community', 'communities',
        'anonymous', 'pseudonymous', 'identification', 'password', 'privacy',
        'public key', 'private key', 'encryption', 'decryption', 'integrity',
        'encryption key', 'decryption key', 'symmetric encryption', 'intercept',
        'man-in-the-middle', 'obfuscation', 'steganography', 'security',
        'anonymity', 'authentication', 'authorization', 'insecure',

    // hand-picked words: society
        'national', 'international', 'political', 'economic', 'organization',
        'activist', 'defense', 'testimony', 'justice', 'injustice',
        'jurisdiction', 'observation', 'indictment', 'prosecution',
        'participant', 'volunteer', 'connect', 'remember', 'individual',
        'newspaper', 'broadcast',
        'Chaos Communication', 'Communication Congress', 'Congress',
        'United States', 'Germany', 'Europe', 'Canada',

    // hand-picked words: science
        'accelerate', 'problem', 'solution', 'science',
        'hypothesis', 'experiment',
        'expensive', 'penalty', 'advantage', 'disadvantage',

    // hand-picked words: space
        'colonization', 'species', 'technology', 'challenge',
        'humanity', 'solar system', 'planet', 'exoplanet',
        'satellite', 'telescope', 'future', 'planetary', 'rocket',
        'Earth', 'Mars', 'colony', 'asteroid', 'space shuttle', 'shuttle',
        'interstellar', 'expansion', 'cosmos', 'reasonable', 'conditions',
        'atmosphere', 'agriculture', 'civilization', 'settlement',
        'residential', 'supply chain', 'transport',

    // hand-picked words: other
        'something', 'everything', 'anything',
        'someone', 'everyone', 'anyone',
        'somebody', 'everybody', 'anybody',
        'somewhere', 'everywhere', 'anywhere',
        'overwhelm', 'overwhelmed', 'overwhelming',
        'dangerous', 'significant', 'remarkable', 'critical', 'devastating',
        'massive', 'widespread', 'profound', 'phenomenon', 'probably',
        'probability', 'statistical', 'user interface', 'unlimited',
        'insignificant', 'underestimate'
    ];

    // < top10000de.txt sort | grep ... | sed -e 's/\(...\)\(.*\)/\1\2 \1/' | uniq -c -f 1 | \
    //     awk '$1 == 1 {print $2}' > german.words
    var deAutocompleteWords = [
        'Aachen', 'Abbau', 'abbauen', 'abend', 'Abend', 'abends',
        'aber', 'Aber', 'abermals', 'Abgesehen', 'Abitur',
        'Abkommen', 'Ablauf', 'ablehnen', 'Ablehnung', 'Abrechnung',
        'Absolventen', 'absolviert', 'abstimmen', 'absurd',
        'abwarten', 'abzubauen', 'Abzug', 'Ach', 'acht', 'Acht',
        'achten', 'Achtung', 'achtzig', 'achtziger', 'achtziger',
        'ADAC', 'Adam', 'Adler', 'Adolf', 'Afghanistan', 'AFP',
        'Afrika', 'afrikanischen', 'Afrikas', 'aggressiv',
        'agieren', 'ahnen', 'Ahnung', 'Aids', 'Airbus', 'Akademie',
        'Alarm', 'Alexander', 'Alfred', 'Algerien', 'Ali',
        'Alkohol', 'all', 'All', 'alle', 'allein', 'Allein',
        'alleine', 'Alleingang', 'Allen', 'Allerdings', 'allerlei',
        'aller', 'alles', 'Alles', 'Allgemeine', 'allgemeinen',
        'allzu', 'als', 'Als', 'also', 'Also', 'Alte', 'alten',
        'Alten', 'alter', 'Alter', 'alternative', 'Alternative',
        'alternativen', 'Alternativen', 'altes', 'Altstadt',
        'Amerikas', 'Ampel', 'Amsterdam', 'Anbau', 'anbieten',
        'anbietet', 'ANC', 'Andere', 'Andererseits', 'Anders',
        'Anerkennung', 'Anfang', 'Angeblich', 'angeboten',
        'Angeboten', 'angekommen', 'Angela', 'Angela', 'Angelika',
        'Angesichts', 'Angreifer', 'angrenzenden', 'Anhebung',
        'Anja', 'ankommt', 'Ankunft', 'anlegen', 'anmelden',
        'annehmen', 'Anneliese', 'Anordnung', 'anpassen',
        'Anpassung', 'ans', 'anscheinend', 'Anschlag', 'ansehen',
        'ansonsten', 'antiken', 'antreten', 'Antwort', 'antworten',
        'Antworten', 'anwesend', 'anzeigen', 'Anzeigen',
        'anzubieten', 'Anzug', 'AOK', 'AOL', 'Appell', 'April',
        'Araber', 'Arafat', 'Arbeit', 'arbeitslos', 'ARD', 'arg',
        'argumentiert', 'Arm', 'arme', 'armen', 'Arnold',
        'asiatischen', 'Asien', 'Astronomen', 'Atomwaffen', 'auch',
        'Auch', 'Audi', 'auf', 'Aufbruch', 'auf', 'aufeinander',
        'Aufgrund', 'aufhalten', 'Aufhebung', 'auf', 'auf',
        'aufkommen', 'aufmerksam', 'aufstellen', 'auftauchen',
        'auftreten', 'Auftreten', 'auftritt', 'aufweisen', 'aus',
        'ausbauen', 'auseinander', 'ausfallen', 'Ausgerechnet',
        'Ausgleich', 'ausmachen', 'aussehen', 'aussieht',
        'auswirken', 'Avantgarde', 'Axel', 'Baby', 'Bach', 'Bad',
        'Bad', 'Bagdad', 'Bakterien', 'bald', 'bar', 'Basel',
        'BASF', 'basiert', 'bat', 'bauen', 'Bayer', 'bayerische',
        'Bayerische', 'bayerischen', 'Bayerischen', 'Bayer', 'BDI',
        'Beachten', 'beachtet', 'Bearbeiten', 'bearbeitet',
        'beauftragt', 'Bedarf', 'Bedenken', 'Bedeutung',
        'Bedrohung', 'Befehl', 'Befreiung', 'befunden',
        'begeistert', 'Begleiter', 'begleitet', 'Begleitung',
        'begriffen', 'Behandlung', 'Behauptung', 'bei', 'Bei',
        'Beide', 'Beifall', 'beigetragen', 'Beihilfe', 'beim',
        'beinahe', 'beinhaltet', 'Beirat', 'beiseite',
        'beispielsweise', 'beitragen', 'Beitritt', 'Bekannte',
        'bekannten', 'Bekannten', 'Bekanntgabe', 'Belange',
        'belaufen', 'belegen', 'Belegschaft', 'Belgien',
        'Belohnung', 'Benutzer', 'benutzt', 'Benzin', 'beobachten',
        'Beobachter', 'beobachtet', 'bequem', 'beraten',
        'berechnet', 'berechtigt', 'berichten', 'Berti', 'Berufung',
        'Beschreibung', 'Beseitigung', 'Besetzung', 'Besitz',
        'besitzen', 'Besitzer', 'Besondere', 'Besonderes',
        'besonders', 'Besonders', 'Besser', 'Besserung', 'bestand',
        'Bestand', 'bestanden', 'Bestandteil', 'beste', 'Beste',
        'Bestehen', 'besten', 'Besten', 'Besteuerung', 'Besuch',
        'besuchen', 'beteuert', 'Beton', 'Betracht', 'betrachten',
        'Betrachter', 'betrachtet', 'Betreiber', 'Betreuer',
        'betreut', 'betrieben', 'Betrieben', 'betrieblichen',
        'Betroffene', 'betroffenen', 'Betroffenen', 'betrug',
        'bevor', 'Bevor', 'bewaffneten', 'Bewag', 'Bewertung',
        'Bezahlung', 'Bezeichnung', 'Bezug', 'bezweifelt', 'BGB',
        'BGH', 'bilden', 'Bill', 'Billionen', 'Bindung', 'binnen',
        'Biographie', 'Birgit', 'birgt', 'bis', 'bisher', 'Bisher',
        'Bislang', 'bitte', 'Bitte', 'Bleibt', 'blutigen', 'BMW',
        'BND', 'Bochum', 'Boeing', 'Bogen', 'Bonn', 'BONN',
        'Bonner', 'Boris', 'Boris', 'Borussia', 'Boston', 'Boykott',
        'brasilianischen', 'Brasilien', 'brav', 'BRD', 'brechen',
        'Brecht', 'Breite', 'bremsen', 'bricht', 'Briten', 'brutal',
        'BSE', 'Buben', 'buchen', 'Buenos', 'Bulgarien', 'Bund',
        'BUND', 'bundesdeutschen', 'Bundesrepublik',
        'Bundeswirtschaftsminister', 'Burg', 'BVG', 'bzw', 'Carl',
        'Center', 'Champions', 'Chemnitz', 'Chirac', 'Chor',
        'Christian', 'City', 'Claudia', 'Coach', 'com', 'Container',
        'Corporation', 'Coup', 'CSU', 'Cursor', 'Customizing',
        'dabei', 'Dabei', 'Dach', 'dachte', 'dadurch', 'Dadurch',
        'DAG', 'dagegen', 'Dagegen', 'Daher', 'Dahinter', 'damit',
        'Damit', 'danach', 'Danach', 'daneben', 'dank', 'Dank',
        'Dann', 'Daran', 'darauf', 'Darauf', 'daraufhin',
        'Daraufhin', 'daraus', 'Daraus', 'darstellen', 'Darsteller',
        'darstellt', 'darum', 'Darum', 'darunter', 'Darunter',
        'darzustellen', 'das', 'dass', 'Dass', 'dasselbe', 'Dauer',
        'David', 'davon', 'Davon', 'davor', 'Dax', 'DAX', 'Dayton',
        'dazu', 'Dazu', 'dazwischen', 'Deal', 'Decke', 'decken',
        'Deckung', 'de', 'dem', 'Dem', 'den', 'Den', 'denen', 'Den',
        'Denn', 'dennoch', 'Dennoch', 'denselben', 'der', 'Der',
        'Deren', 'Derzeit', 'des', 'deshalb', 'dessen', 'Dessen',
        'Deswegen', 'Detail', 'detaillierte', 'Deutsch', 'deutsche',
        'Deutsche', 'Deutsche', 'Deutschen', 'Deutschen',
        'deutscher', 'Deutscher', 'deutsches', 'Deutsche',
        'deutschsprachigen', 'Devise', 'Dezember', 'DFB', 'DGB',
        'd.h.', 'die', 'Die', 'DIE', 'dienstags', 'Diepgen', 'dies',
        'Dies', 'diese', 'Diese', 'Diesem', 'diesen', 'Diesen',
        'dieser', 'Dieser', 'dieses', 'Dieses', 'diesmal', 'Die',
        'Die', 'Dilemma', 'diplomatischen', 'Dividende', 'D-Mark',
        'doch', 'Doch', 'Dollar', 'Dom', 'donnerstags', 'dort',
        'Dort', 'dotierten', 'Dr.', 'Drama', 'Drei', 'Dresdner',
        'dritten', 'Dritten', 'Dritten', 'dritter', 'Dritter',
        'Drogen', 'Druck', 'drucken', 'Drucker', 'DTB', 'Dublin',
        'Duell', 'Duisburg', 'dumm', 'dunkel', 'Dunkelheit', 'Duo',
        'durch', 'Durch', 'durchaus', 'durchgesetzt', 'Durchmesser',
        'durchs', 'Durchschnitt', 'Durchsetzung', 'Dynamik', 'eben',
        'ebenfalls', 'Ebenfalls', 'ebenso', 'Ebenso', 'ebensowenig',
        'Eberhard', 'Eberhard', 'Echo', 'Edith', 'Edmund', 'Eduard',
        'effektiv', 'Effizienz', 'egal', 'ehe', 'ehemaligen',
        'ehemaligen', 'eher', 'Eher', 'ehrlich', 'Eichel', 'Eier',
        'Eigener', 'eigenes', 'Eigenkapital', 'eigens',
        'eigentlich', 'Eigentlich', 'Eigentum', 'eignet', 'ein',
        'Ein', 'einander', 'Einbeziehung', 'einbezogen',
        'einbringen', 'Einbruch', 'Eindruck', 'Eine', 'Einem',
        'einen', 'Einen', 'einer', 'Einer', 'eine', 'einerseits',
        'Einerseits', 'eines', 'Eines', 'eines', 'einheimischen',
        'Einige', 'Einigkeit', 'einigten', 'einmal', 'Einmal',
        'einnehmen', 'Einordnung', 'einrichten', 'eins', 'Eins',
        'einsam', 'Einsicht', 'einsparen', 'Eintracht', 'Eintracht',
        'Eintrag', 'eintreten', 'Eintritt', 'einverstanden',
        'Einzug', 'Elbe', 'Elektronik', 'elf', 'Elke', 'Eltern',
        'Emotionen', 'empfahl', 'Empfang', 'Ende', 'energisch',
        'eng', 'Engel', 'England', 'englisch', 'Englisch', 'Enkel',
        'Ensemble', 'Entdeckung', 'Entfernung', 'Entgegen',
        'Entlastung', 'Entscheidend', 'entspannt', 'Entspannung',
        'Entsprechend', 'Entstehung', 'entweder', 'Entweder',
        'entworfen', 'Entwurf', 'Epoche', 'erbracht', 'ereignete',
        'erfahren', 'erfassen', 'erfolgen', 'Erfolgen',
        'Erforschung', 'Erfurt', 'Erhalt', 'erhalten', 'Erhaltung',
        'Erhebung', 'Erholung', 'Erlaubnis', 'Erleichterung',
        'ermordet', 'Ermordung', 'Erna', 'ernannt', 'Ernennung',
        'erneuert', 'Erneuerung', 'Ernst', 'Ernte', 'Eroberung',
        'erprobt', 'errechnet', 'Erreger', 'Errichtung', 'Ersatz',
        'erscheinen', 'Erscheinen', 'erscheint', 'Erscheinung',
        'Erst', 'Erste', 'Erstellung', 'ersten', 'Ersten',
        'Erstens', 'erster', 'Erster', 'Erstmals', 'erstreckt',
        'Ertrag', 'ertragen', 'Erwin', 'Erwin', 'Erzbischof',
        'erzeugen', 'Erzeugnisse', 'erzeugt', 'Erziehung', 'essen',
        'etc.', 'Ethik', 'ethnischen', 'etliche', 'etwa', 'Etwa',
        'etwas', 'Etwas', 'euch', 'Euch', 'EU-Kommission',
        'Euphorie', 'EUR', 'europaweit', 'e.V.', 'Eva',
        'evangelische', 'Evangelische', 'evangelischen',
        'Evangelischen', 'eventuell', 'exakt', 'Exemplare',
        'Extremisten', 'EZB', 'fahren', 'Falls', 'Fans', 'fassen',
        'Fassung', 'fast', 'fasziniert', 'Faust', 'Fax', 'Fazit',
        'FC', 'FDP', 'Februar', 'Fehlen', 'Feier', 'feiern',
        'Feiern', 'Ferien', 'fern', 'Ferne', 'fest', 'Fest',
        'festlegen', 'feststellen', 'Feststellung', 'fit',
        'flexibel', 'fliegen', 'Fliegen', 'flog', 'Focus', 'Folge',
        'folgen', 'Folgen', 'Folter', 'Fonds', 'for', 'Ford',
        'formal', 'Formel', 'fortsetzen', 'Foyer', 'frage', 'Frage',
        'fragen', 'Fragen', 'FRANKFURT', 'Frankfurt', 'frei',
        'freie', 'Freie', 'freien', 'Freien', 'freier', 'Freigabe',
        'freilich', 'Freizeit', 'Fremde', 'fremden', 'freuen',
        'Freundschaft', 'Friedrich', 'froh', 'Frust', 'Fuchs',
        'Fulda', 'Funktionsbaustein', 'Furcht', 'Fusion',
        'Gabriele', 'Galerie', 'Gang', 'ganz', 'Ganz',
        'ganze', 'Ganze', 'gar', 'Garantie', 'Garten', 'Gattung',
        'gearbeitet', 'Geben', 'gebeten', 'Gebot', 'Gebrauch',
        'gedacht', 'gedeckt', 'Geduld', 'Gefahr', 'gefahren',
        'Gefahren', 'gegeneinander', 'Gegensatz', 'gegenseitig',
        'geglaubt', 'gegriffen', 'gehabt', 'Gehalt', 'Geheimdienst',
        'geheimen', 'Geheimnis', 'gehen', 'Geht', 'geht',
        'Gelassenheit', 'Gelegenheit', 'gemeinsam', 'Gemeinsam',
        'Gemeinschaft', 'gen', 'Gen', 'Genau', 'Gene', 'genehmigt',
        'generell', 'genommen', 'Geplant', 'gerade', 'Gerade',
        'Gerechtigkeit', 'gerichtet', 'gerufen', 'Geschehen',
        'Geschenk', 'geschenkt', 'Geschlecht', 'Geschmack',
        'Geschwindigkeit', 'gesehen', 'Gestalt', 'gestalten',
        'Gestalten', 'gestaltet', 'Gestaltung', 'Geste', 'Gesten',
        'gestern', 'Gestern', 'Getreide', 'Gewalt', 'Gewebe',
        'gewechselt', 'Gewicht', 'gewidmet', 'gewinnen', 'Gewissen',
        'ggf', 'gibt', 'Gibt', 'Gift', 'gilt', 'Gipfel',
        'Gisela', 'Gitarre', 'Glaube', 'glauben', 'Glauben',
        'gleich', 'Gleich', 'Gleichgewicht', 'Gleichwohl',
        'gleichzeitig', 'Gleichzeitig', 'Global', 'GmbH', 'Gnade',
        'Gold', 'Golf', 'Gouverneur', 'Grad', 'Greenpeace', 'Griff',
        'griffen', 'grundlegende', 'Gulden', 'Gunst', 'GUS', 'gut',
        'gute', 'Gute', 'Guten', 'Gutes', 'Gymnasium', 'Haben',
        'Hahn', 'halbwegs', 'Halbzeit', 'half', 'halt', 'Halt',
        'Haltung', 'Hamburger', 'hast', 'hat', 'Hat', 'heben',
        'Hebron', 'hebt', 'Heer', 'Heft', 'heiligen', 'heiraten',
        'Hektar', 'helfen', 'hellen', 'Helmut', 'Helmut',
        'Helsinki', 'Hemd', 'hergestellt', 'Herrscher', 'herzlich',
        'Herzog', 'herzustellen', 'Hessen', 'Hessischen', 'Heute',
        'hierbei', 'Hierbei', 'Hierzu', 'Hill', 'Himmel',
        'Hinsicht', 'Hinter', 'hintereinander', 'Hintergrund',
        'hinzu', 'Hinzu', 'Historiker', 'hob', 'hoch', 'Hoechst',
        'Hof', 'hofft', 'hohe', 'Hohe', 'Holding', 'holen', 'Holz',
        'Hongkong', 'HSV', 'http', 'Humor', 'hundert', 'Hut', 'IBM',
        'ich', 'Ich', 'ideale', 'Ideologie', 'IG', 'ignoriert',
        'ihm', 'Ihm', 'Ihnen', 'ihr', 'Ihr', 'ihre', 'Ihre',
        'ihrem', 'Ihrem', 'ihren', 'Ihren', 'ihrer', 'Ihrer',
        'Ihres', 'II.', 'III', 'Ilse', 'Image', 'im', 'im', 'immer',
        'Immer', 'immerhin', 'Immerhin', 'immer', 'Immer',
        'Immobilien', 'Inc.', 'indem', 'in', 'In', 'in', 'In', 'in',
        'infolge', 'inhaltlich', 'inklusive', 'in', 'Inland', 'in',
        'inmitten', 'innen', 'innere', 'Innere', 'inneren',
        'Inneren', 'innerhalb', 'innovative', 'ins', 'in',
        'Insassen', 'insbesondere', 'insgesamt', 'Insgesamt',
        'insofern', 'installiert', 'inszeniert', 'Inszenierung',
        'Integration', 'Interessierte', 'International',
        'internationale', 'Internationale', 'internationalen',
        'Internationalen', 'interpretiert', 'In-', 'inwieweit',
        'in', 'in', 'inzwischen', 'Inzwischen', 'IOC', 'IRA',
        'Irak', 'Iran', 'Irene', 'Irgendwann', 'irischen', 'Irland',
        'Irmgard', 'Ironie', 'Irrtum', 'Islam', 'isoliert',
        'Israels', 'ist', 'Italiens', 'Ivan', 'IWF', 'Jacques',
        'Jagd', 'jahrelang', 'jahrzehntelang', 'Jahrzehnten',
        'Jakob', 'James', 'Japans', 'Jazz', 'jede', 'Jede', 'Jeden',
        'jedenfalls', 'Jedenfalls', 'jeder', 'Jeder', 'Jedes',
        'Jedoch', 'jeher', 'Jena', 'Jens', 'jenseits', 'Jenseits',
        'Jerusalem', 'Jesus', 'Jetzt', 'Joachim', 'Jochen',
        'Johannes', 'John', 'John', 'Johnson', 'Joschka', 'Jubel',
        'jugendlichen', 'jugoslawischen', 'Junge', 'junge',
        'jungen', 'Jungen', 'junger', 'Jury', 'just', 'Jutta',
        'Kader', 'Kaffee', 'Kanada', 'kanadischen', 'Kann',
        'kaputt', 'Kasten', 'Kauf', 'kaufen', 'Kaum', 'kein',
        'Kein', 'keine', 'Keine', 'Keiner', 'keine', 'Keller',
        'Kenia', 'Kenner', 'kennt', 'Kette', 'Kids', 'kirchlichen',
        'Kl.', 'Klage', 'klagen', 'Klagen', 'Klang', 'Klar',
        'Klaus', 'Klaus', 'Klavier', 'klein', 'Klein', 'kleine',
        'Kleine', 'kleinen', 'Kleinen', 'Kleinstadt', 'Kloster',
        'klug', 'knapp', 'Knapp', 'Kneipe', 'Knie', 'Koch',
        'Koffer', 'Kokain', 'Kombination', 'Kommando', 'Kommission',
        'kommt', 'Kommt', 'konfrontiert', 'Konjunktur',
        'konsequent', 'konstant', 'kontinuierlich', 'konzipiert',
        'Korea', 'korrekt', 'Korruption', 'Kosovo', 'kosten',
        'Kosten', 'Kostenstelle', 'Kraft', 'krank', 'kriegen',
        'kriegt', 'Krupp', 'Kuchen', 'Kugel', 'Kurden',
        'kurdischen', 'kurz', 'Kurz', 'Kuwait', 'Labor', 'lachen',
        'Lachen', 'lacht', 'laden', 'Lafontaine', 'lag', 'Lage',
        'lagen', 'Laien', 'landen', 'Lange', 'Langen', 'langer',
        'Langeweile', 'Lateinamerika', 'laufe', 'Laufe', 'laut',
        'Laut', 'lebe', 'Lebed', 'leben', 'Leben', 'Leder',
        'lediglich', 'Lediglich', 'Lee', 'Leere', 'leeren', 'legen',
        'Lehmann', 'lehrt', 'Leid', 'leiden', 'leider', 'Leider',
        'leidet', 'leiten', 'lenken', 'lernen', 'Lernen', 'lesen',
        'letzte', 'Letzte', 'leuchtet', 'Leverkusen', 'Libanon',
        'Licht', 'liebe', 'Liebe', 'Lieber', 'liebevoll',
        'Liebhaber', 'Lieferanten', 'Liga', 'linke', 'Linke',
        'linken', 'Linken', 'links', 'Lippen', 'Lire', 'Literatur',
        'litt', 'live', 'Lizenz', 'Lkw', 'Lob', 'Loch', 'Logik',
        'logische', 'Logistik', 'lohnt', 'Lokal', 'los', 'Los',
        'Los', 'Lothar', 'lsw', 'Ltd', 'lud', 'Lupe', 'Lust',
        'lustig', 'Lutz', 'Lyrik', 'Maastricht', 'Macht', 'Madrid',
        'Mafia', 'mag', 'mahnte', 'Major', 'Makler', 'mal', 'Mama',
        'man', 'Manche', 'manuell', 'markieren', 'Markieren',
        'markiert', 'Max', 'maximal', 'Mazedonien',
        'Mecklenburg-Vorpommern', 'Meer', 'Mehmet', 'mehr', 'Mehr',
        'mehrere', 'Mehrere', 'mein', 'Mein', 'meine', 'Meine',
        'meist', 'Meist', 'Menschlichkeit', 'merken', 'merkt',
        'Messe', 'messen', 'Mexiko', 'Meyer', 'Miami', 'mich',
        'Michael', 'Michael', 'minder', 'mindestens', 'minus',
        'Mio', 'mir', 'Mir', 'mit', 'mit', 'Mitleid',
        'mittelalterlichen', 'mittelfristig', 'mittels',
        'Mittelstand', 'mitten', 'Mitternacht', 'mitunter',
        'mochte', 'moderne', 'Moderne', 'Modernisierung', 'Mohamed',
        'Moment', 'momentan', 'Momente', 'monatlich', 'montags',
        'Moral', 'morgen', 'Morgen', 'Mozart', 'Mr.', 'Mrd',
        'Multimedia', 'nach', 'nachdem', 'Nachdem', 'nachdenken',
        'nachfolgenden', 'Nachkriegszeit', 'nachmittag', 'nachts',
        'Nachweis', 'nachweisen', 'nach', 'Nach', 'Nachwuchs',
        'nachzudenken', 'Nagel', 'Nahen', 'nationale', 'Nationale',
        'nationalen', 'Nationalen', 'nationaler', 'NATO', 'Nazis',
        'Nebel', 'neben', 'Neben', 'Nebenwirkungen', 'nebst',
        'Nehmen', 'Neigung', 'nein', 'Nein', 'Nerven', 'net',
        'Netanjahu', 'nett', 'neu', 'neue', 'Neue', 'Neuen',
        'neuer', 'Neuer', 'Neues', 'Neugier', 'neun', 'Neun',
        'neunziger', 'New', 'New', 'New', 'nicht', 'Nicht', 'nicht',
        'nicht', 'nichts', 'Nichts', 'nichts', 'nie', 'Nie',
        'nieder', 'Niemand', 'Nigeria', 'Nikolaus', 'nimmt',
        'nirgendwo', 'Niveau', 'nix', 'noch', 'Noch', 'nominiert',
        'norwegischen', 'Notwendigkeit', 'Nr.', 'NRW', 'null',
        'Null', 'Nummer', 'Nummer', 'Nummern', 'nun', 'Nun',
        'nunmehr', 'nur', 'Nur', 'nutzen', 'Nutzung', 'Oberbayern',
        'Obst', 'obwohl', 'Obwohl', 'oder', 'Oder', 'offen',
        'offenbar', 'Offenbar', 'Offenheit', 'oft', 'Oft',
        'oftmals', 'ohne', 'Ohne', 'ohnehin', 'Oktober',
        'Oldenburg', 'OLG', 'Olga', 'Oliver', 'olympischen',
        'Olympischen', 'Olympischen', 'Onkel', 'online',
        'Opposition', 'Optimismus', 'optimistisch', 'Orchester',
        'Orden', 'Ordnung', 'Oskar', 'Oskar', 'Oslo', 'Ost', 'OSZE',
        'ots', 'Otto', 'paar', 'packen', 'parallel', 'parat', 'PDS',
        'Pech', 'peinlich', 'Peking', 'per', 'perfekt', 'Pfarrer',
        'pflegen', 'Pflegeversicherung', 'pflegt', 'Pfund',
        'Pistole', 'PKK', 'Pkw', 'planen', 'plant', 'plaziert',
        'Pleite', 'plus', 'Podium', 'Poesie', 'Politische', 'Pop',
        'Potential', 'Potsdamer', 'Praxis', 'Prenzlauer',
        'prinzipiell', 'Prinzipien', 'Private', 'Privatisierung',
        'pro', 'problematisch', 'problemlos', 'Prof',
        'prognostiziert', 'Propaganda', 'prophezeit', 'psychisch',
        'psychologische', 'quasi', 'quer', 'Quote', 'Rabin',
        'Rache', 'Radio', 'Rainer', 'Raketen', 'Ralf', 'Rat',
        'raten', 'raus', 'realistisch', 'Rebellen', 'Recherchen',
        'Rechner', 'rechnet', 'recht', 'Recht', 'rechte', 'Rechte',
        'rechten', 'Rechten', 'rechtzeitig', 'reden', 'Reden',
        'redet', 'Redner', 'Reduzierung', 'Regel', 'regeln',
        'Regeln', 'regelrecht', 'Rehhagel', 'reich', 'Reich',
        'Reichen', 'reichlich', 'Reichstag', 'reisen', 'relativ',
        'Release', 'relevanten', 'Religion', 'Rems-Murr-Kreis',
        'renommierten', 'reserviert', 'restlichen', 'Resultat',
        'retten', 'Rettung', 'Reuter', 'Rexrodt', 'Rhythmus',
        'Richard', 'richten', 'Richter', 'Richtig', 'Rio', 'Ritter',
        'Rivalen', 'Robert', 'Rock', 'rollen', 'Rollen', 'rollt',
        'Roman', 'rot', 'Rot', 'Rover', 'RTL', 'rtr', 'Ruanda',
        'Rubel', 'Rudolf', 'Rudolf', 'Ruf', 'rufen', 'Rufnummer',
        'ruft', 'Ruhe', 'ruhen', 'Ruhestand', 'ruhig', 'Ruhm',
        'rund', 'runden', 'runter', 'Russen', 'Russland', 'Ruth',
        'rutschte', 'RWE', 'Sabine', 'sachlich', 'Saddam', 'Sagen',
        'Saison', 'Sand', 'San', 'Sanierung', 'sank', 'Sanktionen',
        'Sat', 'satt', 'sauber', 'Saudi-Arabien', 'sauer', 'S-Bahn',
        'schade', 'Schade', 'schaden', 'schauen', 'schaut',
        'Scheitern', 'schicken', 'Schicksal', 'Schiedsrichter',
        'schien', 'Schiene', 'schildert', 'schimpft', 'schlafen',
        'Schlag', 'schlagen', 'Schleswig-Holstein', 'Schluss',
        'schmalen', 'schon', 'schreiben', 'schreibt',
        'Schreibtisch', 'schrieb', 'schriftlich', 'schrittweise',
        'Schubert', 'schuf', 'Schuhe', 'schuld', 'schuldig',
        'Schwangerschaft', 'schwarz', 'Schwarz', 'schwarze',
        'Schwarze', 'schwarzen', 'Schwarzen', 'Schweden', 'Schwere',
        'schwersten', 'sechs', 'Sechs', 'sechziger', 'sechziger',
        'SED', 'sehr', 'Sehr', 'Sein', 'seine', 'Seine', 'Seinen',
        'Seit', 'seitdem', 'seiten', 'Seiten', 'Seither', 'senden',
        'senken', 'Seoul', 'September', 'serviert', 'Sex', 'Shell',
        'Show', 'sich', 'Sich', 'sicher', 'Sicher', 'Sichern',
        'sid', 'sie', 'Sie', 'sieben', 'Sieben', 'siebziger',
        'siebziger', 'Siehe', 'sieht', 'Siemens', 'signalisiert',
        'Silber', 'Simon', 'sind', 'Sir', 'sitzen', 'Sitzen',
        'sitzt', 'Skandal', 'Skepsis', 'skeptisch', 'Skulpturen',
        'Slobodan', 'Smith', 'sobald', 'Sobald', 'soeben',
        'Software', 'Sogar', 'so', 'solange', 'Solange', 'Solche',
        'Soll', 'Sollte', 'sollten', 'Sollten', 'Somalia', 'somit',
        'Sonst', 'sonstige', 'Sonstige', 'sonstigen', 'Sony',
        'Sorge', 'sorgen', 'Sorgen', 'Sound', 'soviel', 'soweit',
        'Soweit', 'Sowjetunion', 'sowohl', 'Sowohl', 'sozial',
        'sozusagen', 'sparen', 'spart', 'spekuliert',
        'spezialisiert', 'Spezialisten', 'Spiegel', 'spiegelt',
        'Spiel', 'spiele', 'Spiele', 'spielen', 'spielt',
        'Spieltag', 'spontan', 'Sports', 'sprach', 'Sprache',
        'sprachen', 'Sprachen', 'springt', 'Srebrenica', 'St.',
        'standen', 'stationiert', 'statt', 'Stefan', 'Steffi',
        'Steigerung', 'steigt', 'stelle', 'Stelle', 'stellen',
        'sterben', 'steuert', 'still', 'Stille', 'stillen',
        'stimmen', 'Stimmen', 'Stimmung', 'stirbt', 'Stirn',
        'stolz', 'Stolz', 'stoppen', 'Story', 'St.', 'strahlt',
        'streichen', 'Strich', 'strikt', 'studieren',
        'Studierenden', 'stundenlang', 'STUTTGART', 'Stuttgarter',
        'StZ', 'Suche', 'Sucht', 'Supermarkt', 'Susanne', 'Sydney',
        'Syrien', 'System', 'systematisch', 'TAGESSPIEGEL',
        'Taiwan', 'Taktik', 'tanzen', 'tat', 'Tat', 'taten',
        'Taxifahrer', 'taz', 'Technische', 'technischen',
        'Technischen', 'technischer', 'Tee', 'Teheran', 'teil',
        'teilen', 'Teilen', 'teilgenommen', 'Teilnahme',
        'teilnehmen', 'teils', 'Teils', 'Teilung', 'Tel',
        'telefonisch', 'Teppich', 'Test', 'testen', 'Tests',
        'teuer', 'Teufel', 'Thailand', 'the', 'theoretisch', 'Theo',
        'Thomas', 'Thron', 'Thyssen', 'tief', 'Tief', 'tiefe',
        'Tiefe', 'Tiger', 'Tips', 'Tisch', 'Tokio', 'Toleranz',
        'toll', 'Tony', 'Tote', 'toten', 'Toten', 'Tradition',
        'Traditionen', 'Transrapid', 'Treff', 'treffen', 'treiben',
        'Treiben', 'treibt', 'tritt', 'Triumph', 'trocken', 'Trost',
        'trotz', 'Trotz', 'trotzdem', 'Trotzdem',
        'tschetschenischen', 'tun', 'Tunnel', 'tut', 'Typs', 'u.a.',
        'U-Bahn', 'Ude', 'Udo', 'UdSSR', 'Ufer', 'Ukraine', 'Umbau',
        'Umfang', 'Umgang', 'Umgebung', 'umliegenden', 'ums',
        'umsetzen', 'Umsetzung', 'Umstrukturierung', 'Umzug',
        'Unbekannte', 'unbekannten', 'Unbekannten', 'und', 'Und',
        'unerwartet', 'Unfall', 'ungarischen', 'Ungarn',
        'unheimlich', 'unklar', 'Unmut', 'UNO', 'uns', 'unser',
        'Unser', 'unsere', 'Unsere', 'Unter', 'unter', 'Unter',
        'Unterbringung', 'Unterdessen', 'Untergang',
        'untergebracht', 'Untergrund', 'unterlag', 'Unterlagen',
        'unternommen', 'Unterricht', 'Unterzeichnung', 'USA',
        'US-amerikanischen', 'USD', 'usw', 'Ute', 'Utopie', 'Uwe',
        'vage', 'van', 'v.Chr.', 'Veba', 'vehement', 'Venedig',
        'Verabschiedung', 'Veranstalter', 'veranstaltet', 'Verbot',
        'verbraucht', 'Verbrechen', 'Verbreitung', 'Verbund',
        'Verein', 'Vereinigten', 'vereint', 'Vereinten',
        'verfallen', 'Vergangenheit', 'Verhaftung', 'verhalten',
        'Verhalten', 'Verkauf', 'verkraften', 'verlagert',
        'Verlagerung', 'Verlauf', 'Verleger', 'verlegt',
        'Verlegung', 'Verletzte', 'verletzten', 'Verlierer',
        'vermag', 'Vermarktung', 'Vermieter', 'vernichtet',
        'Versammlung', 'Verschiebung', 'Versicherer', 'Versorgung',
        'Versprechen', 'Verstand', 'Versuch', 'versuche',
        'Versuche', 'versuchen', 'Versuchen', 'Verteidiger',
        'vertrat', 'Vertrauen', 'Vertreibung', 'vertreten',
        'Verurteilung', 'Verwandten', 'Verzicht', 'Verzweiflung',
        'Veto', 'VfB', 'VfB', 'vgl', 'via', 'Viag', 'viel', 'Viel',
        'viele', 'Viele', 'Vielfalt', 'vielleicht', 'Vielleicht',
        'vielmehr', 'vier', 'Vier', 'Vietnam', 'Viktor', 'Villa',
        'Viren', 'Virus', 'Volumen', 'vom', 'Vom', 'von', 'Von',
        'von', 'voneinander', 'vor', 'Vor', 'vorab', 'Vorabend',
        'vor', 'Vor', 'voraussichtlich', 'Vorbehalte', 'vorerst',
        'vorgehen', 'Vorhaben', 'Vorhang', 'vorkommen', 'Vorlage',
        'vorlegen', 'Vorliebe', 'Vormittag', 'vor', 'Vorrang',
        'vorrangig', 'vorsorglich', 'vor', 'Vorwurf', 'Votum',
        'Vulkan', 'vwd', 'Wachstum', 'wagen', 'wagt', 'Wahrheit',
        'Wahrnehmung', 'wahrscheinlich', 'Waigel', 'Wald', 'Wall',
        'Walter', 'Wann', 'war', 'waren', 'Waren', 'warten',
        'Warten', 'Warum', 'was', 'WDR', 'Weber', 'Wechsel',
        'weder', 'Weder', 'weg', 'wegen', 'weh', 'Wehr', 'wehren',
        'Wehrmacht', 'wehrt', 'weil', 'weisen', 'Weisheit', 'Weit',
        'Weite', 'weitere', 'Weitere', 'weiteren',
        'Weiterentwicklung', 'Weiterhin', 'Welche', 'WELT',
        'weltweit', 'Weltweit', 'wem', 'wen', 'Wende', 'Wenig',
        'wenige', 'Wenige', 'Weniger', 'Wenn', 'wenngleich', 'wer',
        'Wer', 'werben', 'Werbung', 'Werden', 'werdenden', 'Werder',
        'werfen', 'wert', 'Wesen', 'West', 'wichtig', 'Wichtig',
        'Wichtigste', 'wichtigsten', 'wie', 'Wie', 'wieder',
        'Wiederholung', 'wiederum', 'wiegt', 'wies', 'wiesen',
        'Wiesen', 'wieviel', 'Wieviel', 'will', 'willen',
        'willkommen', 'Wimbledon', 'winzigen', 'wir', 'Wir', 'Wird',
        'Wirklichkeit', 'wobei', 'Wobei', 'wodurch', 'wohnen',
        'wohnt', 'Wollen', 'womit', 'wonach', 'wovon', 'wozu',
        'WTO', 'wuchs', 'Wunsch', 'Wurzeln', 'Wut', 'www', 'Yen',
        'Zagreb', 'Zahl', 'zahlen', 'Zahlen', 'zahlreiche',
        'Zahlreiche', 'Zaire', 'z.', 'z.B.', 'ZDF', 'zehn',
        'zehnten', 'Zeichen', 'ZEIT', 'zeitlich', 'zeitweise',
        'zentral', 'Zentralbank', 'zentrale', 'Zentrale',
        'zentralen', 'Zinsen', 'Zirkus', 'Zitat', 'Zone', 'Zoo',
        'Zorn', 'Zucker', 'zudem', 'Zudem', 'Zuerst', 'Zufall',
        'zukommen', 'Zukunft', 'zulassen', 'Zulassung', 'Zuletzt',
        'zum', 'Zum', 'zumal', 'Zumal', 'zum', 'Zum', 'zum', 'Zum',
        'zum', 'Zum', 'Zumindest', 'Zunahme', 'Zunge', 'zuordnen',
        'Zuordnung', 'zur', 'Zur', 'zurecht', 'zur', 'Zur',
        'zusammen', 'zusammenarbeiten', 'Zusammenbruch',
        'Zustimmung', 'Zuversicht', 'Zuvor', 'Zwang', 'Zwar',
        'zwei', 'Zwei', 'Zweifel', 'Zweite', 'Zweitens', 'Zweiten',
        'zweiter', 'Zweiter', 'zweites', 'Zwischen', 'Zyklus',
        'Übereinstimmungen',

    // Translated hacker words
        'Computer', 'Software', 'Hardware', 'Exploit', 'Sicherheitslücke',
        'Firmware', 'Attacke', 'Veröffentlichung', 'Device', 'Gerät',
        'Malware', 'Forschung', 'Nachweis', 'bekanntgeben', 'veröffentlichen',
        'implementieren', 'ankündigen', 'Community', 'Chaos', 'Communities',
        'Nation', 'Staat', 'Überwachung', 'Privatsphäre', 'international',
        'politisch', 'Politik', 'Wirtschaft', 'Organisation', 'Gemeinschaft',
        'staatlich', 'Freiheit', 'Angst', 'Aktivist', 'Aktivismus', 'Abwehr',
        'Cyber', 'Justiz', 'Gericht', 'Prozess', 'Defense', 'Gerechtigkeit',
        'Ungerechtigkeit', 'Zeuge', 'Aussage', 'Gutachten', 'Beobachtung',
        'beobachten', 'Verfahren', 'Chaos Communication',
        'Communication Congress', 'Congress', 'Anwendung', 'Application',
        'Server', 'Client', 'Netzwerk', 'Ethernet', 'Architektur', 'Request',
        'Protokoll', 'abstrakt', 'virtuell', 'Virtualisierung',
        'Operating System', 'Betriebssystem', 'Container', 'Einführung',
        'Handbuch', 'bauen', 'kompilieren', 'kontinuierlich', 'Integration',
        'Continuous Integration', 'Modul', 'Assembly', 'Assembler',
        'Paket', 'deploy', 'Angriff',
        'Cloud', 'Wolke', 'beschleunigen', 'Hypothese', 'Lösung',
        'Wissenschaft', 'Chemie', 'Rechnen', 'Rechner', 'Experiment',
        'Infrastruktur', 'Datenbank', 'Optimierung', 'Optimieren',
        'optimieren', 'experimentieren', 'verstehen', 'Verständnis', 'Testen',
        'Unit Tests', 'Kompiler', 'kompilieren', 'Latenz', 'Durchsatz',
        'Performanz', 'zuwachsend', 'wachsend', 'Kapazität', 'teuer',
        'Penalty', 'Strafe', 'Vorteil', 'Nachteil', 'Teilnehmer',
        'Freiwilliger', 'verbinden', 'Verbindung', 'erinnern', 'Gedenken',
        'irgendjemand', 'irgendwer', 'irgendwas', 'jede', 'Internet',
        'Provider', 'Telekommunikationsprovider', 'anonym',
        'Passwort', 'Authentifizierung', 'authentifizieren', 'Pseudonym',
        'Passwort', 'Amerika', 'Deutschland', 'Platform', 'Europa', 'Kanada',
        'Frankreich', 'Private Key', 'Public Key', 'Verschlüsselung',
        'verschlüssel', 'Entschlüsselung', 'entschlüsseln', 'Integrität',
        'symmetrisch', 'Intercept', 'Man-in-the-Middle', 'Sicherheit',
        'Verschleierung', 'Obfuscation', 'Sicherheit', 'Anonymität',
        'kritisch', 'deutsch', 'Verwirrung', 'verwirren', 'Sicherheit',
        'Security', 'Safety', 'Anonymität', 'Autorisierung', 'Legitimierung',
        'gefährlich', 'Gefahr', 'bedeutend', 'bedeutsam', 'bemerkenswert',
        'Bemerkung', 'massiv', 'wesentlich', 'maßgeblich', 'wichtig',
        'verheerend', 'verwüstend', 'Phänomen', 'Wahrscheinlichkeit', 'Statistik',
	'statistisch', 'signifikant', 'User Interface',
    ];

    var resetDictionary = function (initialWords) {
        completions = {};
        isCompleted = {};
        for (var i = initialWords.length - 1; i >= 0; i--) {
            addCompletion(initialWords[i]);
        }
    };

    var initialWordSets = {
        'en': enAutocompleteWords,
        'de': deAutocompleteWords
    };

    resetDictionary(initialWordSets['en']);

    window.setTimeout(function() {
        document.body.style.lineHeight = '1.5';
        var pendingArea = document.querySelector('div[style="display: flex; flex-direction: column-reverse;"]');
        pendingArea.style.padding = '2em 0 0 0';
        pendingArea.style.opacity = '0.6';
        pendingArea.style.fontStyle = 'italic';

        var field = document.querySelector('input');
        field.style.fontFamily = 'Roboto';
        field.style.fontSize = '16px';

        var parent = field.parentElement;
        parent.style.position = 'relative';

        var hint = document.createElement('span');
        hint.style.fontSize = '16px';
        hint.style.position = 'absolute';
        hint.style.left = field.offsetLeft + 'px';
        hint.style.bottom = '2px';
        hint.style.height = field.offsetHeight + 'px';
        hint.style.right = '0px';
        hint.style.color = '#2c2';
        hint.style.pointerEvents = 'none';
        hint.style.textAlign = 'right';
        hint.innerText = 'use TAB to autocomplete\xa0\xa0';
        parent.appendChild(hint);

        var measure = document.createElement('span');
        measure.style.position = 'absolute';
        measure.style.opacity = '0';
        measure.style.fontSize = '16px';
        parent.appendChild(measure);

        var buttonBox = document.createElement('div');
        buttonBox.style.position = 'absolute';
        buttonBox.style.top = '2px';
        buttonBox.style.right = '6px';
        buttonBox.style.zIndex = '9999';
        buttonBox.style.fontFamily = 'Roboto';
        buttonBox.style.fontSize = '12px';
        buttonBox.innerText = 'Reset autocompletions to:\xa0';
        document.body.appendChild(buttonBox);

        var isCaseSensitive = {
            'en': true,
            'de': false
        };
        var addResetButton = function(lang) {
            var reset = document.createElement('button');
            reset.innerText = lang;
            reset.addEventListener('click', function() {
                caseSensitiveCompletion = isCaseSensitive[lang];
                resetDictionary(initialWordSets[lang]);
            });
            buttonBox.appendChild(reset);
        };
        addResetButton('en');
        addResetButton('de');

        function measureWidth(text) {
            measure.innerText = text;
            return measure.offsetWidth;
        }

        var inputEvent = new Event('input', { bubbles: true });
        var lastWord = '';
        var lastTwoWords = '';

        var handleKeyDown = function(keyEvent) {
            if (keyEvent.keyCode === 9) {
                keyEvent.preventDefault();  // don't move focus
            }
        };
        var handleKeyUp = function(keyEvent) {
            var keyCode = keyEvent.keyCode;
            if (keyCode === 32 || keyCode === 13) {
                var word = lastWord.replace(/[^a-zA-Z0-9\xc0-\xff]*$/, '');  // ignore trailing punctuation
                timesTyped[word] = (timesTyped[word] || 0) + 1;
                if (timesTyped[word] >= 2) {
                    addCompletion(word);
                }
                if (lastTwoWords) {
                    var twoWords = lastTwoWords.replace(/[^a-zA-Z0-9\xc0-\xff]*$/, '');  // ignore trailing punctuation
                    timesTyped[twoWords] = (timesTyped[twoWords] || 0) + 1;
                    if (timesTyped[twoWords] >= 2) {
                        addCompletion(twoWords);
                    }
                }
            }

            lastWord = field.value.replace(/.* /, '');
            if (!caseSensitiveCompletion) lastWord = lastWord.toLowerCase();
            var twoWordMatch = field.value.match(/\S\S\S+ \S\S\S+$/);
            lastTwoWords = twoWordMatch ? twoWordMatch[0] : null;
            var completion = completions[lastWord];
            if (keyCode === 9 && completion) {  // tab
                field.value += completion;
                field.dispatchEvent(inputEvent);  // make React notice the new text
                lastWord = field.value.replace(/.* /, '');  // maybe complete a longer word
                if (!caseSensitiveCompletion) lastWord = lastWord.toLowerCase();
                completion = completions[lastWord];
            }
            hint.innerText = completion || '';
            if (completion) {
                hint.style.left = (4 + measureWidth(field.value)) + 'px';
                hint.style.textAlign = 'left';
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }, 3000);
})();

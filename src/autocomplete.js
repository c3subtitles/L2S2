/* eslint-disable */
(function() {
    var timesTyped = {};
    var completions = {};
    var isCompleted = {};

    var addCompletion = function(word) {
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
    var autocompleteWords = [
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
        'yellow'
    ];

    // grep -v '[A-Z]' < 3000-common-words.txt | sort | grep ... | sed -e 's/\(...\)\(.*\)/\1\2 \1/' | uniq -c -f 1 | grep '^ *1 ' | grep -o '[a-z][a-z][a-z][a-z][a-z]*' > autocomplete-words-2.txt
    var autocompleteWords2 = [
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
        'wipe', 'wire', 'woman', 'wrap', 'wrong', 'yard', 'yield', 'zone'
    ];

    // from https://en.wikipedia.org/wiki/Most_common_words_in_English
    var commonWords = [
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
        'all', 'would', 'there', 'their'
    ];

    // A few hand-picked words.
    var hackerWords = [
        'computer', 'software', 'hardware', 'exploit', 'vulnerability',
        'firmware', 'malware', 'attack', 'intrusion', 'protection', 'detection',
        'embedded', 'device', 'peripheral', 'implementation', 'implement',
        'disclosure', 'publication', 'research', 'announce', 'announcement',
        'communicate', 'communication', 'community', 'communities',
        'national', 'international', 'political', 'economic', 'organization',
        'activist', 'defense', 'testimony', 'justice', 'injustice',
        'jurisdiction', 'observation', 'indictment', 'prosecution',
        'Chaos Communication', 'Communication Congress', 'Congress',
        'application', 'server', 'network', 'Ethernet',
        'architecture', 'request', 'protocol', 'abstract', 'virtual',
        'container', 'virtualization', 'operating', 'system', 'instruction',
        'building', 'build', 'continuous', 'integration', 'interface',
        'module', 'assembly', 'package', 'deploy', 'deployment',
        'service', 'cloud', 'accelerate', 'problem', 'solution', 'science',
        'hypothesis', 'experiment', 'database', 'infrastructure',
        'optimize', 'optimization', 'understand', 'testing', 'compiler',
        'latency' ,'performance', 'incremental', 'throughput', 'capacity',
        'expensive', 'penalty', 'advantage', 'disadvantage',
        'participant', 'volunteer', 'connect', 'remember', 'individual',
        'something', 'everything', 'anything',
        'someone', 'everyone', 'anyone',
        'somebody', 'everybody', 'anybody',
        'somewhere', 'everywhere', 'anywhere',
        'overwhelm', 'overwhelmed', 'overwhelming',
        'Internet', 'telecommunications', 'provider', 'platform',
        'anonymous', 'pseudonymous', 'identification', 'password', 'privacy',
        'United States', 'Germany', 'Europe', 'Canada',
        'public key', 'private key', 'encryption', 'decryption', 'integrity',
        'encryption key', 'decryption key', 'symmetric encryption', 'intercept',
        'man-in-the-middle', 'obfuscation', 'steganography', 'security',
        'anonymity', 'authentication', 'authorization', 'insecure',
        'dangerous', 'significant', 'remarkable', 'critical', 'devastating',
        'massive', 'widespread', 'profound', 'phenomenon', 'probably',
        'probability', 'statistical', 'user interface',
        'interplanetary', 'colonization', 'species',
        'Liz George', 'Peter Buschkamp', 'technological', 'challenge',
        'humanity', 'solar system', 'planet', 'exoplanet', 'astronomer',
        'satellite', 'telescope', 'future', 'planetary', 'rocket',
        'Earth', 'Mars', 'colony', 'asteroid', 'space shuttle', 'shuttle',
        'interstellar', 'expansion', 'cosmos', 'reasonable', 'conditions',
        'atmosphere', 'agriculture', 'civilization', 'settlement',
        'residential', 'supply chain', 'transport'
    ];

    var initialWords = autocompleteWords.concat(
        autocompleteWords2).concat(commonWords).concat(hackerWords);
    for (var i = 0; i < initialWords.length; i++) {
        addCompletion(initialWords[i]);
    }

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
            var twoWordMatch = field.value.match(/\S\S\S+ \S\S\S+$/);
            lastTwoWords = twoWordMatch ? twoWordMatch[0] : null;
            var completion = completions[lastWord];
            if (keyCode === 9 && completion) {  // tab
                field.value += completion;
                field.dispatchEvent(inputEvent);  // make React notice the new text
                lastWord = field.value.replace(/.* /, '');  // maybe complete a longer word
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

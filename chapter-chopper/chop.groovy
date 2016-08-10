class ChopChop {

    /** Reusable writer */
    Writer chapterWriter

    /** File line separator */
    String separator = System.getProperty("line.separator")

    /** Chapters to skip */
    def chaptersToSkip


    /* Multiple enemies occur on several lines, so we maintain a processing state.
           <p><font face="Courier New" size="2">                HABILETÉ   ENDURANCE</font></p>
           <p><font face="Courier New" size="2">Premier BANDIT      7           6</font></p>
           <p><font face="Courier New" size="2">Deuxième BANDIT     7           8</font></p>
    */
    boolean stateMultipleEnemies = false
    List<Enemy> enemies = []


    String buildChapterLink(chapter) {
        "<a chapter=\"${chapter}\"></a>"
    }

    String _buildSpellsOrChapterLinks(spellsOrChapters, thoseAreChapterLinks) {
        StringBuilder sb = new StringBuilder('<div class="row-fluid">')
        sb.append "\n"
        spellsOrChapters.each { spellsOrChapter ->
            sb.append('    <span class="span1">')
              .append(thoseAreChapterLinks ? buildChapterLink(spellsOrChapter) : spellsOrChapter)
              .append "</span>\n"
        }
        sb.append '</div>'

        sb.toString()
    }

    String buildSpellsRow(spells) {
        _buildSpellsOrChapterLinks spells, false
    }

    String buildSpellsChapterLinks(chapters) {
        _buildSpellsOrChapterLinks chapters, true
    }

    /**
     * Build rows for enemies.
     */
    String buildEnemies(enemies) {
        StringBuilder sb = new StringBuilder('<div class="row-fluid">')
        sb.append('<div class="row-fluid">').append("\n")
          .append('    <div class="span3">&nbsp;</div>').append("\n")
          .append('    <div class="span2">HABILETÉ</div>').append("\n")
          .append('    <div class="span2">ENDURANCE</div>').append("\n")
          .append('</div>').append("\n\n")

        enemies.each { enemy ->
            sb.append('<div class="row-fluid">').append("\n")
              .append('    <div class="span3">').append(enemy.name).append('</div>').append("\n")
              .append('    <div class="span2">').append(enemy.skills).append('</div>').append("\n")
              .append('    <div class="span2">').append(enemy.stamina).append('</div>').append("\n")
              .append('</div>').append("\n")
        }

        sb.toString()
    }

    /**
     * Extract chapter number from line
     */
    Integer extractChapterNumberFrom(line) {
        def matcher = line =~ /.*\[\[([0-9]+)\]\].*/
        return matcher.matches() ? new Integer(matcher[0][1]) : null
    }

    void emit(line) {
        chapterWriter << line << separator
    }

    /**
     * Process a line (images, links, ...)
     */
    void next(line) {
        
        // Multiple enemies: process next enemy
        if (stateMultipleEnemies) {
            def anEnemyRegex = /.*font face="Courier New".*>(.*) *([0-9]+) *([0-9]+)<\/font>.*/
            def anEnemyMatcher = line =~ anEnemyRegex
            if (anEnemyMatcher.matches()) {
                // That's another enemy
                def enemy = Enemy.fromMatcher(anEnemyMatcher)
                enemies << enemy
                return           // maybe more next line
            } else {
                // No more enemies, all are ready
                String manyEnemies = buildEnemies enemies
                emit manyEnemies
                // Reset mutli enemies state
                enemies = []
                stateMultipleEnemies = false
                // don't return, carry on with this line
            }
        }

        // Emit chapter, if present in line
        def chapter = extractChapterNumberFrom line
        if (chapter) {
            emit "<h1>$chapter</h1>\n"
            return
        }

        // Transform image link
        def imgSrcMatcher = line =~ /.*src=\".*\/(.*\.gif)\".*/
        if (imgSrcMatcher.matches()) {
            def gif = imgSrcMatcher[0][1]
            emit "<img src=\"img/sorcery/01/${gif}\"/>"
            return
        }

        // Single enemy (note: some lines are split w/ <br>, not detected here)
        def singleEnemyRegex = /.*<font face="Courier New".*>(.*)HABILETÉ : ([0-9]+).*ENDURANCE : ([0-9]+)<\/font>.*/
        def singleEnemyMatcher = line =~ singleEnemyRegex
        if (singleEnemyMatcher.matches()) {
            def enemy = Enemy.fromMatcher(singleEnemyMatcher)
            def enemyStr = buildEnemies([enemy])
            emit enemyStr
            return
        }

        // Trigger multiple enemies: set the state
        def multipleEnemiesRegex = /<font face="Courier New".*> *HABILETÉ *ENDURANCE<\/font>/
        if (line.find(multipleEnemiesRegex)) {
            stateMultipleEnemies = true
            enemies = []
            return       // enemies found on next lines
        }

        // Extract proposed spells and corresponding chapters.
        // Superflous whitespace have been spotted, can't rely on 5 spells (3 letters + 1 space)
        def spellsMatcher = line =~ /<p align="center"><font face="Courier New">(.*)<\/font><\/p>/
        if (spellsMatcher.matches()) {
            def spellsOrLinks = spellsMatcher[0][1]
            def tokens = spellsOrLinks.tokenize()
            if (tokens.size() == 5) {
                //println tokens
                if (tokens.every { it.matches(~/[A-Z]{3}/) }) {
                    // Those are spells
                    def spells = buildSpellsRow tokens
                    emit spells
                    return
                } else if (tokens.every { it.matches(~/\[[0-9]{3}\]/) }) {
                    // Those are spells chapters
                    def chapters = []
                    tokens.each { t ->
                        def c =  t.replace('[', '')
                        c = c.replace(']', '')
                        chapters << c
                    }
                    def ch = buildSpellsChapterLinks chapters
                    emit ch
                    return
                }
            }
        }

        // Chapter links
        line = line.replaceAll(/\[([0-9]+)\]/, '<a chapter="$1"/>')

        // Remove space after &laquo; and &raquo;
        line = line.replaceAll(/(&[rl]aquo;) ?/, '$1')

        // Now that's a beautiful line
        emit line
    }

    void chopBook(fullBookFile, outputDirStr) {

        def currentChapter
        chapterWriter = new CharArrayWriter()

        println "Started"
        fullBookFile.eachLine { line ->
            def chapter = this.extractChapterNumberFrom line
            if (chapter) {
                chapterWriter.close()
                if (chapter in chaptersToSkip) {
                    println "Skip chapter $chapter"
                    chapterWriter = new CharArrayWriter()
                } else {
                    println "New chapter: $chapter"
                    chapterWriter = new File("${outputDirStr}/chapter${chapter}.html").newWriter('UTF-8')
                    emit "<!-- Automatically parsed from single HTML, not reviewed -->"
                }
                currentChapter = chapter
            }
            this.next(line)
        }

        println "All read"
        chapterWriter.close()
    }


    /**
     * Chapters to skip (already processed manually), stored one per line in a file.
     */
    int loadAlreadyProcessed(file) {
        chaptersToSkip = [] as List
        file.eachLine { chapter -> chaptersToSkip << (chapter as int) }
        println chaptersToSkip
        return chaptersToSkip.size()
    }

}


/**
 * Enemy
 */
class Enemy {
    String name
    int skills
    int stamina

    static Enemy fromMatcher(matcher) {
        def enemy = new Enemy()
        enemy.name = matcher[0][1].trim()
        enemy.skills = matcher[0][2] as int
        enemy.stamina = matcher[0][3] as int
        return enemy
    }
}




// Source file, single html
File book = new File('full.html')

// New output directory
new File('chapters').mkdir()

ChopChop chopper = new ChopChop()
int alreadyProcessedCount = chopper.loadAlreadyProcessed(new File('already_processed.txt'))
println "Skipping $alreadyProcessedCount chapters"
chopper.chopBook(book, 'chapters')

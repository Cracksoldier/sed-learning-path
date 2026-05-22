/* All sed learning path content. Loaded before app.js. */
const LEARNING_PATH = [
  /* ──────────────────────────────────────────────────────────────────────
     TIER 1 — BEGINNER
  ─────────────────────────────────────────────────────────────────────── */
  {
    id: 'tier-1',
    tier: 1,
    title: 'Beginner',
    subtitle: 'First steps with stream editing',
    badge: "sed -n '1p'",
    topics: [
      {
        id: 't1-what-is-sed',
        title: 'What is sed?',
        body: 'sed (stream editor) reads input line by line, applies editing commands, and writes the result to stdout. It never modifies the original file by default, making it safe for experimentation. Because it processes one line at a time, it can handle files larger than RAM efficiently.',
        examples: [
          { label: 'Echo through sed (identity transform)', code: "echo 'Hello, World!' | sed ''" },
          { label: 'Process a file', code: 'sed \'s/foo/bar/\' input.txt' },
          { label: 'Read from stdin, write to file', code: 'cat data.txt | sed \'s/old/new/\' > output.txt' },
        ],
        resources: [
          { label: 'GNU sed manual — Introduction', url: 'https://www.gnu.org/software/sed/manual/sed.html#Introduction', desc: 'Official reference' },
          { label: 'POSIX sed specification', url: 'https://pubs.opengroup.org/onlinepubs/9699919799/utilities/sed.html', desc: 'Portable behavior' },
        ],
      },
      {
        id: 't1-substitution',
        title: 'The substitution command: s/pattern/replacement/',
        body: 'The s command is the workhorse of sed. It searches for a BRE (Basic Regular Expression) pattern and replaces the match with a replacement string. The replacement can reference the whole match or capture groups.',
        examples: [
          { label: 'Simple word replacement', code: "sed 's/cat/dog/' file.txt" },
          { label: 'Custom delimiter (avoids escaping /)', code: "sed 's|/usr/local|/opt|' paths.txt" },
          { label: 'Backreference \\1 in replacement', code: "echo 'John Smith' | sed 's/\\(\\w\\+\\) \\(\\w\\+\\)/\\2, \\1/'" },
          { label: 'Empty replacement (delete match)', code: "sed 's/[0-9]//g' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — The s command', url: 'https://www.gnu.org/software/sed/manual/sed.html#The-_0022s_0022-Command', desc: 'Full flag reference' },
        ],
      },
      {
        id: 't1-flags',
        title: 'Substitution flags: g, i, and nth occurrence',
        body: 'Without flags, s replaces only the first match on each line. Flags change this: g replaces all matches, a number replaces only the nth match, and i (GNU) makes matching case-insensitive. Flags can be combined.',
        examples: [
          { label: 'Global replace (all occurrences per line)', code: "echo 'banana' | sed 's/a/A/g'" },
          { label: 'Case-insensitive (GNU)', code: "echo 'Hello HELLO hello' | sed 's/hello/Hi/Ig'" },
          { label: 'Replace only the 2nd occurrence', code: "echo 'banana' | sed 's/a/A/2'" },
          { label: 'Replace from 2nd occurrence onward', code: "echo 'banana' | sed 's/a/A/2g'" },
        ],
        resources: [
          { label: 'GNU sed flags', url: 'https://www.gnu.org/software/sed/manual/sed.html#The-_0022s_0022-Command', desc: 'GNU sed manual' },
        ],
      },
      {
        id: 't1-print',
        title: 'Print selectively: -n and p',
        body: 'By default sed prints every line after processing. The -n flag suppresses this automatic print. The p command explicitly prints the current pattern space. Together, -n and p let you filter lines like a smarter grep.',
        examples: [
          { label: 'Print lines matching a pattern (like grep)', code: "sed -n '/error/p' logfile.txt" },
          { label: 'Print line numbers of matches', code: "sed -n '/pattern/=' file.txt" },
          { label: 'Print lines 5 through 10', code: "sed -n '5,10p' file.txt" },
          { label: 'Print last line', code: "sed -n '$p' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — Invoking sed (-n)', url: 'https://www.gnu.org/software/sed/manual/sed.html#Invoking-sed', desc: 'Command-line options' },
        ],
      },
      {
        id: 't1-delete',
        title: 'Delete lines with d',
        body: 'The d command deletes the current line from the output and immediately starts the next cycle. It is the complement of p: instead of selecting lines to keep, you select lines to remove.',
        examples: [
          { label: 'Delete blank lines', code: "sed '/^$/d' file.txt" },
          { label: 'Delete lines containing a word', code: "sed '/TODO/d' file.txt" },
          { label: 'Delete the first line (header)', code: "sed '1d' file.txt" },
          { label: 'Delete last line', code: "sed '$d' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — Common commands', url: 'https://www.gnu.org/software/sed/manual/sed.html#Common-Commands', desc: 'p, d, q and friends' },
        ],
      },
    ],
    challenges: [
      {
        id: 'c1-1',
        title: 'Replace only the first occurrence of "the" with "THE" in a file (not global)',
        hint: 'The s command without the g flag replaces only the first match per line. Try: sed \'s/the/THE/\' file.txt',
      },
      {
        id: 'c1-2',
        title: 'Globally replace every run of whitespace (spaces and tabs) with a single space',
        hint: 'Pattern: [[:space:]]\\+ matches one or more whitespace characters. Use the g flag: sed \'s/[[:space:]]\\+/ /g\'',
      },
      {
        id: 'c1-3',
        title: 'Print only lines that contain an "@" character (mimicking a simple email filter)',
        hint: 'Use -n to suppress default output, and /pattern/p to print matches: sed -n \'/@/p\' file.txt',
      },
      {
        id: 'c1-4',
        title: 'Delete all comment lines that begin with # (common in config files)',
        hint: '^# anchors to start of line. Use: sed \'/^#/d\' file.txt',
      },
      {
        id: 'c1-5',
        title: 'Case-insensitively replace every occurrence of "linux" with "Linux" throughout a file',
        hint: 'Combine the I (case-insensitive) and g (global) flags: sed \'s/linux/Linux/Ig\' file.txt',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────────────────
     TIER 2 — INTERMEDIATE
  ─────────────────────────────────────────────────────────────────────── */
  {
    id: 'tier-2',
    tier: 2,
    title: 'Intermediate',
    subtitle: 'Addressing, multi-commands, and in-place editing',
    badge: "sed -i -e '...' -e '...'",
    topics: [
      {
        id: 't2-addresses',
        title: 'Address expressions: line numbers, patterns, and ranges',
        body: 'Every sed command can be preceded by an address to restrict which lines it applies to. An address can be a line number, the special $ (last line), a /regex/, or a range addr1,addr2. Without an address, the command applies to all lines.',
        examples: [
          { label: 'Specific line number', code: "sed '5s/old/new/' file.txt" },
          { label: 'Last line', code: "sed '$d' file.txt" },
          { label: 'Line range', code: "sed '2,8s/old/new/' file.txt" },
          { label: 'Pattern-to-pattern range', code: "sed '/START/,/END/d' file.txt" },
          { label: 'Every 2nd line (GNU step syntax)', code: "sed '0~2d' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — Addresses', url: 'https://www.gnu.org/software/sed/manual/sed.html#Addresses', desc: 'All address forms' },
        ],
      },
      {
        id: 't2-negation',
        title: 'Negation with !',
        body: 'Appending ! after an address inverts it: the command runs on every line that does NOT match. This is useful for deleting everything except matching lines, or protecting certain lines from transformation.',
        examples: [
          { label: 'Delete all lines NOT matching pattern', code: "sed '/keep/!d' file.txt" },
          { label: 'Replace everywhere except line 1', code: "sed '1!s/old/new/g' file.txt" },
          { label: 'Apply to all lines outside a range', code: "sed '10,20!s/old/new/' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — Addresses (negation)', url: 'https://www.gnu.org/software/sed/manual/sed.html#Addresses', desc: 'The ! modifier' },
        ],
      },
      {
        id: 't2-multiple-commands',
        title: 'Multiple commands: -e and semicolons',
        body: 'Multiple sed commands can be given using repeated -e flags, separated by semicolons, or stored in a script file (-f). The commands execute in order on each line.',
        examples: [
          { label: 'Two -e expressions', code: "sed -e 's/foo/bar/' -e 's/baz/qux/' file.txt" },
          { label: 'Semicolon separator', code: "sed 's/foo/bar/;s/baz/qux/' file.txt" },
          { label: 'Script file', code: 'sed -f commands.sed file.txt' },
          { label: 'Heredoc (no temp file)', code: "sed -f - file.txt <<'EOF'\ns/foo/bar/\ns/baz/qux/\nEOF" },
        ],
        resources: [
          { label: 'GNU sed — Multiple commands', url: 'https://www.gnu.org/software/sed/manual/sed.html#Multiple-commands-syntax', desc: 'Chaining expressions' },
        ],
      },
      {
        id: 't2-inplace',
        title: 'In-place editing with -i',
        body: 'The -i flag writes changes back to the original file. Use -i.bak to create a backup first (strongly recommended). Note: macOS BSD sed requires an explicit suffix: sed -i \'\' (empty string), while GNU sed accepts -i alone.',
        examples: [
          { label: 'Edit in place — GNU', code: "sed -i 's/old/new/' file.txt" },
          { label: 'Edit in place with backup', code: "sed -i.bak 's/old/new/' file.txt" },
          { label: 'Update version across all Markdown files', code: "sed -i 's/v1\\.0/v2.0/g' *.md" },
          { label: 'macOS BSD compatible form', code: "sed -i '' 's/old/new/' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — In-place editing', url: 'https://www.gnu.org/software/sed/manual/sed.html#Other-Commands', desc: 'The -i flag' },
        ],
      },
      {
        id: 't2-aic',
        title: 'Append, insert, change, and grouping: a, i, c, { }',
        body: 'a appends text after the addressed line; i inserts before it; c replaces the addressed line(s) entirely. Braces group multiple commands under a single address, reducing repetition.',
        examples: [
          { label: 'Append a line after a match', code: "sed '/SECTION/a\\  # subsection' file.txt" },
          { label: 'Insert shebang at top', code: "sed '1i\\#!/usr/bin/env bash' script.sh" },
          { label: 'Change a matching line', code: "sed '/version:.*/c\\version: 2.0' config.yaml" },
          { label: 'Group commands on one address', code: "sed '/error/ { s/error/ERROR/; s/$/!/; }' log.txt" },
        ],
        resources: [
          { label: 'GNU sed — a, i, c commands', url: 'https://www.gnu.org/software/sed/manual/sed.html#Other-Commands', desc: 'Insert and append' },
        ],
      },
    ],
    challenges: [
      {
        id: 'c2-1',
        title: 'Delete lines 10 through 20 from a file in-place, keeping a .bak backup',
        hint: 'Combine the 10,20 address range with d and use -i.bak: sed -i.bak \'10,20d\' file.txt',
      },
      {
        id: 'c2-2',
        title: 'Replace "TODO" with "DONE" on every line that does NOT also contain the word "skip"',
        hint: 'Use negation with a grouped condition. The key is /skip/!s/TODO/DONE/ — the ! inverts the /skip/ address.',
      },
      {
        id: 'c2-3',
        title: 'Insert "#!/usr/bin/env bash" as the very first line of a shell script (in place)',
        hint: "Address line 1 with insert: sed -i '1i\\#!/usr/bin/env bash' script.sh",
      },
      {
        id: 'c2-4',
        title: 'Remove all lines between (and including) ## BEGIN and ## END markers',
        hint: "Use a pattern range: sed '/## BEGIN/,/## END/d' file.txt",
      },
      {
        id: 'c2-5',
        title: 'Using grouping, on every line containing "ERROR": uppercase the word ERROR and append " !!!" to the line end',
        hint: "sed '/ERROR/ { s/error/ERROR/Ig; s/$/ !!!/ }' log.txt — two commands inside one address group.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────────────────
     TIER 3 — ADVANCED
  ─────────────────────────────────────────────────────────────────────── */
  {
    id: 'tier-3',
    tier: 3,
    title: 'Advanced',
    subtitle: 'Hold space, multi-line processing, branching, and file I/O',
    badge: "sed -n 'H;${x;s/\\n/,/g;p}'",
    topics: [
      {
        id: 't3-holdspace',
        title: 'Hold space: h, H, g, G, x',
        body: 'sed has two string buffers. The pattern space holds the current line being processed. The hold space is persistent across cycles — it starts empty and retains its value until explicitly changed. h copies pattern→hold; H appends pattern to hold (with newline); g copies hold→pattern; G appends hold to pattern; x exchanges the two.',
        examples: [
          { label: 'Duplicate every line (print + hold appended)', code: "sed 'h;G' file.txt" },
          { label: 'Collect all lines, then print comma-joined', code: "sed -n 'H;${g;s/\\n/,/g;s/^,//;p}' file.txt" },
          { label: 'Classic reverse lines (Tac)', code: "sed -n '1!G;h;$p' file.txt" },
          { label: 'Swap adjacent lines', code: "sed -n 'h;n;p;g;p' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — Hold space commands', url: 'https://www.gnu.org/software/sed/manual/sed.html#Other-Commands', desc: 'h, H, g, G, x' },
          { label: 'Hold space explained visually', url: 'https://www.grymoire.com/Unix/Sed.html#uh-58', desc: 'Grymoire sed guide' },
        ],
      },
      {
        id: 't3-multiline',
        title: 'Multi-line commands: N, P, D',
        body: 'N appends the next line to the pattern space, separated by \\n — creating a two-line window. P prints only up to the first \\n in the pattern space. D deletes up to the first \\n and restarts the cycle without reading a new line. Together they enable sliding-window processing.',
        examples: [
          { label: 'Join continuation lines (lines ending with backslash)', code: "sed ':a;N;s/\\\\\\n//;ba' file.txt" },
          { label: 'Delete blank lines following a colon-ending line', code: "sed '/: *$/{N;/\\n *$/d}' file.txt" },
          { label: 'Print pairs of lines as one', code: "sed 'N;s/\\n/ /' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — Multiline techniques', url: 'https://www.gnu.org/software/sed/manual/sed.html#multiline', desc: 'N, P, D commands' },
        ],
      },
      {
        id: 't3-branching',
        title: 'Branching and loops: b, t, T, and labels',
        body: 'Labels mark positions in the script with :label. b label jumps there unconditionally (b alone jumps to end). t label jumps only if a successful s command has run since the last line was read or t was tested. T label (GNU) jumps only if no s has succeeded. These enable loops inside sed.',
        examples: [
          { label: 'Collapse multiple spaces into one (loop)', code: "sed ':loop; s/  / /; t loop' file.txt" },
          { label: 'Skip remaining commands for matched lines', code: "sed '/already-done/b; s/todo/done/' file.txt" },
          { label: 'Add commas to numbers (1234567 → 1,234,567)', code: "sed ':a;s/\\(.*[0-9]\\)\\([0-9]\\{3\\}\\)/\\1,\\2/;ta'" },
        ],
        resources: [
          { label: 'GNU sed — Branching', url: 'https://www.gnu.org/software/sed/manual/sed.html#Branching-and-flow-control', desc: 'b, t, T, and labels' },
        ],
      },
      {
        id: 't3-readwrite',
        title: 'File I/O: r and w',
        body: 'r filename reads the file and appends its contents after the current line (executed after the cycle, so changes to the pattern space do not affect it). w filename writes the pattern space to a file (truncated at start, appended on subsequent writes). These enable sed to act as a simple templating or routing tool.',
        examples: [
          { label: 'Inject file contents after a marker', code: "sed '/INSERT_TEMPLATE/r template.txt' file.txt" },
          { label: 'Write matching lines to a separate file', code: "sed -n '/ERROR/w errors.log' app.log" },
          { label: 'Route lines to different output files', code: "sed -n '/^INFO/w info.log; /^WARN/w warn.log; /^ERROR/w error.log' app.log" },
        ],
        resources: [
          { label: 'GNU sed — r and w commands', url: 'https://www.gnu.org/software/sed/manual/sed.html#Other-Commands', desc: 'File read/write' },
        ],
      },
      {
        id: 't3-extended-regex',
        title: 'Extended regular expressions with -E',
        body: 'With -E (POSIX) or -r (GNU alias), sed uses ERE syntax: +, ?, and | work without backslashes; grouping uses () instead of \\(\\). This produces far more readable patterns for anything beyond simple substitutions.',
        examples: [
          { label: 'Match one or more digits', code: "sed -E 's/[0-9]+/NUM/g' file.txt" },
          { label: 'Alternation', code: "sed -E 's/cat|dog/pet/g' file.txt" },
          { label: 'Capture groups and backreferences', code: "echo 'John Smith' | sed -E 's/(\\w+) (\\w+)/\\2, \\1/'" },
          { label: 'Optional match', code: "sed -E 's/colou?r/color/g' file.txt" },
        ],
        resources: [
          { label: 'GNU sed — ERE syntax', url: 'https://www.gnu.org/software/sed/manual/sed.html#ERE-syntax', desc: 'Extended regex reference' },
        ],
      },
    ],
    challenges: [
      {
        id: 'c3-1',
        title: 'Reverse the order of all lines in a file using hold space (implement "tac" in sed)',
        hint: "Classic: sed -n '1!G;h;$p' file.txt — accumulates lines in hold space, prints all at end.",
      },
      {
        id: 'c3-2',
        title: 'Join continuation lines: any line ending with \\ should be joined to the following line',
        hint: "sed ':a;N;s/\\\\\\n//;ba' — the loop reads the next line (N), removes the backslash-newline, and repeats until no match.",
      },
      {
        id: 'c3-3',
        title: 'Using -E, extract all IPv4 addresses from a log file (print only the IP, one per line)',
        hint: "sed -En 's/.*([0-9]{1,3}(\\.[0-9]{1,3}){3}).*/\\1/p' logfile.txt",
      },
      {
        id: 'c3-4',
        title: 'Use a branch loop to format numbers with comma thousands separators (e.g. 1234567 → 1,234,567)',
        hint: "sed ':a;s/\\(.*[0-9]\\)\\([0-9]\\{3\\}\\)/\\1,\\2/;ta' — loops until no more insertions are needed.",
      },
      {
        id: 'c3-5',
        title: 'Write all lines matching /ERROR/ to a file errors.log while also printing all lines to stdout',
        hint: "sed '/ERROR/w errors.log' app.log — the w command is a side effect; normal output continues unchanged.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────────────────
     TIER 4 — EXPERT
  ─────────────────────────────────────────────────────────────────────── */
  {
    id: 'tier-4',
    tier: 4,
    title: 'Expert',
    subtitle: 'Scripts, pipelines, performance, and real-world patterns',
    badge: 'sed -f script.sed | sort | uniq',
    topics: [
      {
        id: 't4-scripts',
        title: 'Writing sed script files',
        body: 'For anything beyond a one-liner, put your sed commands in a .sed script file (sed -f). GNU sed supports # comments. You can mix addresses, groups, labels, and blanks freely. Script files are version-controllable, testable, and reusable across pipelines.',
        examples: [
          { label: 'A commented script file', code: '# normalize.sed\n# Collapse whitespace\ns/[[:space:]]\\+/ /g\n# Trim leading whitespace\ns/^ //\n# Convert curly quotes\ns/\\xe2\\x80\\x98/\'/g\ns/\\xe2\\x80\\x99/\'/g' },
          { label: 'Invoke the script', code: 'sed -f normalize.sed input.txt > output.txt' },
          { label: 'Combine script file with -e', code: "sed -f base.sed -e 's/staging/production/g' config.txt" },
        ],
        resources: [
          { label: 'GNU sed — Script files', url: 'https://www.gnu.org/software/sed/manual/sed.html#sed-scripts', desc: 'sed -f reference' },
          { label: 'catonmat — sed one-liners explained', url: 'https://catonmat.net/sed-one-liners-explained-part-one', desc: 'Annotated examples' },
        ],
      },
      {
        id: 't4-pipelines',
        title: 'sed in pipelines with other Unix tools',
        body: 'sed shines as one stage in a pipeline. It pairs naturally with grep (filter), awk (structured data), sort/uniq (deduplication), cut (field extraction), tr (character translation), and xargs (parallel application). Knowing which tool to reach for is half the skill.',
        examples: [
          { label: 'Extract and normalize email addresses', code: "grep -o '[^[:space:]]*@[^[:space:]]*' mail.log \\\n  | sed 's/[<>]//g' \\\n  | sort -u" },
          { label: 'Stream-edit a remote config', code: "curl -sS https://example.com/app.conf \\\n  | sed 's/staging/production/g' \\\n  > prod.conf" },
          { label: 'In-place edit across many files (xargs)', code: "find . -name '*.js' -print0 \\\n  | xargs -0 sed -i 's/require(/import(/g'" },
        ],
        resources: [
          { label: 'Unix Philosophy', url: 'https://en.wikipedia.org/wiki/Unix_philosophy', desc: 'The "do one thing well" context' },
          { label: 'Eric Pement — sed one-liners', url: 'http://sed.sourceforge.net/sed1line.txt', desc: 'Classic collection of useful one-liners' },
        ],
      },
      {
        id: 't4-performance',
        title: 'Performance and efficiency',
        body: 'sed is fast, but large files and complex patterns can be tuned. Guard expensive substitutions behind a pattern address so they only run on matching lines. Prefer single-pass scripts over multiple sed invocations. GNU sed\'s -z (NUL-delimited) and --sandbox modes serve special needs.',
        examples: [
          { label: 'Guard a substitution (only run s on matching lines)', code: "sed '/keyword/s/old/new/g' big.txt" },
          { label: 'Single pass instead of two sed calls', code: "sed 's/a/A/g;s/b/B/g;s/c/C/g' big.txt > out.txt" },
          { label: 'NUL-delimited records (GNU)', code: "sed -z 's/\\n/ /g' file.txt" },
          { label: 'Sandbox mode (disables r, w, e commands)', code: "sed --sandbox -f untrusted.sed file.txt" },
        ],
        resources: [
          { label: 'GNU sed — Performance notes', url: 'https://www.gnu.org/software/sed/manual/sed.html#Reporting-Bugs', desc: 'GNU sed internals' },
        ],
      },
      {
        id: 't4-realworld',
        title: 'Real-world patterns',
        body: 'Production uses of sed: config file munging, log transformation, code generation, template instantiation, stripping terminal escape codes, and semver bumping. These patterns appear regularly in CI/CD pipelines, build scripts, and sysadmin tooling.',
        examples: [
          { label: 'Strip ANSI escape codes from log files', code: "sed 's/\\x1b\\[[0-9;]*[mGKHF]//g' colored.log" },
          { label: 'Extract the 3rd CSV column (no quoted commas)', code: "sed -E 's/^([^,]*,){2}([^,]*).*/\\2/' data.csv" },
          { label: 'Bump patch version in package.json (GNU /e flag)', code: 'sed -E \'s/(\"version\": \"[0-9]+\\.[0-9]+\\.)([0-9]+)/echo "\\1$(( \\2 + 1 ))"/e\' package.json' },
          { label: 'Uncomment a specific config key', code: "sed 's/^# *\\(MaxConnections\\)/\\1/' /etc/app.conf" },
        ],
        resources: [
          { label: 'catonmat — sed one-liners (part 1)', url: 'https://catonmat.net/sed-one-liners-explained-part-one', desc: 'Explained real-world patterns' },
          { label: 'catonmat — sed one-liners (part 2)', url: 'https://catonmat.net/sed-one-liners-explained-part-two', desc: 'More advanced patterns' },
        ],
      },
      {
        id: 't4-debugging',
        title: 'Debugging sed scripts',
        body: 'sed has no built-in interactive debugger, but several techniques help. The = command prints the current line number. Isolating the script to a small input reproduces issues quickly. GNU sed\'s --sandbox prevents r/w/e side effects during testing. sedsed is a third-party step debugger.',
        examples: [
          { label: 'Print line numbers alongside output', code: "sed '=' file.txt | sed 'N;s/\\n/\\t/'" },
          { label: 'Trace substitutions by printing before and after', code: "sed -e 'p' -e 's/old/new/' -n file.txt" },
          { label: 'sedsed step debugger (third party)', code: "sedsed --debug -e 's/foo/bar/' file.txt" },
          { label: 'Test with minimal input', code: "printf 'line1\\nline2\\nline3\\n' | sed -n '2{s/line/LINE/;p}'" },
        ],
        resources: [
          { label: 'GNU sed --sandbox', url: 'https://www.gnu.org/software/sed/manual/sed.html#Invoking-sed', desc: 'Safe testing mode' },
          { label: 'sedsed debugger', url: 'https://aurelio.net/projects/sedsed/', desc: 'Visual step-through debugger' },
          { label: 'Grymoire sed tutorial', url: 'https://www.grymoire.com/Unix/Sed.html', desc: 'Deep explanatory guide' },
        ],
      },
    ],
    challenges: [
      {
        id: 'c4-1',
        title: 'Write a .sed script that: collapses multiple consecutive blank lines into one, trims trailing whitespace from every line',
        hint: "Two operations: s/[[:space:]]\\+$// for trailing whitespace; for blank lines: /^$/{ N; /^\\n$/d } — read the next line and delete if it is also blank.",
      },
      {
        id: 'c4-2',
        title: 'Extract all unique HTTP status codes from an nginx access log using a sed+sort+uniq pipeline',
        hint: "sed -E 's/.* ([0-9]{3}) .*/\\1/' access.log | sort | uniq — the ERE captures the 3-digit status code field.",
      },
      {
        id: 'c4-3',
        title: 'Strip all ANSI color escape codes from a log file while preserving all other content exactly',
        hint: "The pattern covers ESC + [ + optional numbers/semicolons + a final letter: sed 's/\\x1b\\[[0-9;]*[mGKHF]//g' colored.log",
      },
      {
        id: 'c4-4',
        title: 'Using the GNU /e flag, increment the patch version number in a version string like "version: 1.2.3"',
        hint: "sed -E 's/(version: [0-9]+\\.[0-9]+\\.)([0-9]+)/echo \"\\1$(( \\2 + 1 ))\"/e' file.txt — the /e flag executes the replacement as a shell command.",
      },
      {
        id: 'c4-5',
        title: 'Write a pipeline that processes a web server access log: keep only 5xx errors, extract the URL path and status code, sort and deduplicate',
        hint: "grep ' 5[0-9][0-9] ' access.log | sed -E 's|.*(GET|POST|PUT|DELETE) ([^ ]+) .* ([0-9]{3}) .*|\\3 \\2|' | sort -u — combine grep for initial filter, sed for extraction.",
      },
    ],
  },
];

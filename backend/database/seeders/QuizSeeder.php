<?php

namespace Database\Seeders;

use App\Enums\Difficulty;
use App\Models\Category;
use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Port of the mobile stub constant QUIZ_BY_CATEGORY (QuizScreen.tsx).
     */
    public function run(): void
    {
        $data = [
            'History of Computing' => [
                Difficulty::Easy->value => [
                    ['question' => 'Who is considered the first programmer?', 'options' => ['Grace Hopper', 'Ada Lovelace', 'Margaret Hamilton', 'Katherine Johnson'], 'answer' => 1],
                    ['question' => 'The ENIAC was primarily built for what purpose?', 'options' => ['Weather forecasting', 'Ballistics calculations', 'Business payroll', 'Space navigation'], 'answer' => 1],
                    ['question' => 'Which company released the first GUI personal computer in 1984?', 'options' => ['IBM', 'Microsoft', 'Commodore', 'Apple'], 'answer' => 3],
                ],
                Difficulty::Medium->value => [
                    ['question' => 'Which of these storage types is volatile?', 'options' => ['SSD', 'HDD', 'RAM', 'ROM'], 'answer' => 2],
                    ['question' => 'Who designed the Analytical Engine?', 'options' => ['Alan Turing', 'Ada Lovelace', 'Charles Babbage', 'Grace Hopper'], 'answer' => 2],
                    ['question' => 'What does the Turing test evaluate?', 'options' => ['A machine’s ability to exhibit intelligent behavior', 'Encryption strength', 'Program execution speed', 'Amount of stored data'], 'answer' => 0],
                ],
                Difficulty::Hard->value => [
                    ['question' => 'Where was the UNIX operating system developed?', 'options' => ['Microsoft', 'IBM', 'Xerox PARC', 'Bell Labs'], 'answer' => 3],
                    ['question' => 'Which standard defines the common floating-point formats used in computing?', 'options' => ['ISO 8859-1', 'RFC 791', 'IEEE 754', 'ECMA-262'], 'answer' => 2],
                    ['question' => 'The first working model of Babbage’s Difference Engine was completed by which organization?', 'options' => ['IBM', 'The Science Museum London', 'MIT', 'Hewlett-Packard'], 'answer' => 1],
                ],
            ],
            'Cybersecurity' => [
                Difficulty::Easy->value => [
                    ['question' => 'Phishing is best described as:', 'options' => ['Tricking users into revealing credentials', 'Flooding a server with requests', 'Encrypting files for ransom', 'Intercepting network packets'], 'answer' => 0],
                    ['question' => 'What does HTTPS add over plain HTTP?', 'options' => ['Faster loading', 'More bandwidth', 'Encryption of traffic', 'Longer URLs'], 'answer' => 2],
                    ['question' => 'Which of these is an example of multi-factor authentication?', 'options' => ['Username only', 'Password only', 'Password plus a one-time code', 'PIN only'], 'answer' => 2],
                ],
                Difficulty::Medium->value => [
                    ['question' => 'A man-in-the-middle attack involves:', 'options' => ['Brute-forcing passwords', 'Relaying and altering messages between two parties', 'Injecting malware into a database', 'Social engineering a CEO'], 'answer' => 1],
                    ['question' => 'The principle of least privilege means:', 'options' => ['Granting the minimum access required to do a job', 'Allowing all users equal access', 'Monitoring all traffic', 'Encrypting all stored data'], 'answer' => 0],
                    ['question' => 'Which of these is a strong password?', 'options' => ['Your birth date', 'A long, unique passphrase', 'Admin123', 'Your email password reused'], 'answer' => 1],
                ],
                Difficulty::Hard->value => [
                    ['question' => 'In symmetric encryption, the same key is used for:', 'options' => ['Encryption and decryption', 'Key exchange and signing', 'Encryption only', 'Hash generation'], 'answer' => 0],
                    ['question' => 'A replay attack involves:', 'options' => ['Resending a captured valid transmission', 'Brute-forcing a hash', 'DNS poisoning', 'SQL injection'], 'answer' => 0],
                    ['question' => 'A zero-day vulnerability means:', 'options' => ['A bug with no vendor patch yet', 'An attack that lasts 24 hours', 'A weekend-only outage', 'A flaw found only in testing'], 'answer' => 0],
                ],
            ],
            'Web Development' => [
                Difficulty::Easy->value => [
                    ['question' => 'HTML is used for:', 'options' => ['Styling and layout', 'Structure and content', 'Behavior and logic', 'Storing and querying data'], 'answer' => 1],
                    ['question' => 'Which CSS property controls the space inside an element’s border?', 'options' => ['margin', 'gap', 'border', 'padding'], 'answer' => 3],
                    ['question' => 'Which HTTP status code means “Not Found”?', 'options' => ['200', '301', '404', '500'], 'answer' => 2],
                ],
                Difficulty::Medium->value => [
                    ['question' => 'In the DOM, event bubbling describes:', 'options' => ['Events propagating from child elements up to parents', 'Events moving from parent to child', 'Errors restarting the page', 'React components re-rendering'], 'answer' => 0],
                    ['question' => 'React’s virtual DOM is best described as:', 'options' => ['A real DOM rendered in a sandbox', 'An in-memory representation of the UI that React diffs', 'A server-side renderer', 'A browser API for styling'], 'answer' => 1],
                    ['question' => 'Which tag links an external CSS file?', 'options' => ['<style>', '<script>', '<meta>', '<link>'], 'answer' => 3],
                ],
                Difficulty::Hard->value => [
                    ['question' => 'Which HTTP method is idempotent and updates a full resource?', 'options' => ['POST', 'PATCH', 'DELETE', 'PUT'], 'answer' => 3],
                    ['question' => 'CORS primarily protects browsers against:', 'options' => ['Cross-origin reads', 'SQL injection', 'Session fixation', 'Packet sniffing'], 'answer' => 0],
                    ['question' => 'A common React memory leak happens when:', 'options' => ['State is set after an unmounted component without cleanup', 'Too many components exist', 'Global CSS is used', 'The network is slow'], 'answer' => 0],
                ],
            ],
            'Computer Networks' => [
                Difficulty::Easy->value => [
                    ['question' => 'What does DNS do?', 'options' => ['Routes packets between networks', 'Resolves domain names to IP addresses', 'Encrypts traffic in transit', 'Assigns MAC addresses to devices'], 'answer' => 1],
                    ['question' => 'A MAC address operates at which OSI layer?', 'options' => ['Layer 2', 'Layer 3', 'Layer 4', 'Layer 7'], 'answer' => 0],
                    ['question' => 'Which protocol is connection-oriented and reliable?', 'options' => ['UDP', 'HTTP', 'ICMP', 'TCP'], 'answer' => 3],
                ],
                Difficulty::Medium->value => [
                    ['question' => 'What is a subnet mask used for?', 'options' => ['Determining the network and host portion of an IP address', 'Encrypting IP headers', 'Compressing data payloads', 'Assigning port numbers'], 'answer' => 0],
                    ['question' => 'A switch forwards frames based on:', 'options' => ['IP address', 'MAC address', 'Domain name', 'Port number'], 'answer' => 1],
                    ['question' => 'Routing between networks occurs at which OSI layer?', 'options' => ['Physical', 'Data link', 'Network', 'Transport'], 'answer' => 2],
                ],
                Difficulty::Hard->value => [
                    ['question' => 'How many usable host addresses does a /24 subnet give?', 'options' => ['254', '256', '255', '128'], 'answer' => 0],
                    ['question' => 'Which protocol dynamically assigns IP addresses to devices?', 'options' => ['ARP', 'DHCP', 'ICMP', 'BGP'], 'answer' => 1],
                    ['question' => 'What does NAT do?', 'options' => ['Maps private IPs to a public IP for internet access', 'Encrypts packets in transit', 'Signs digital certificates', 'Load-balances traffic'], 'answer' => 0],
                ],
            ],
        ];

        foreach ($data as $categoryName => $difficulties) {
            $category = Category::create(['name' => $categoryName]);
            foreach ($difficulties as $difficulty => $questions) {
                foreach ($questions as $position => $item) {
                    $question = Question::create([
                        'category_id' => $category->id,
                        'difficulty' => $difficulty,
                        'question' => $item['question'],
                        'position' => $position,
                    ]);
                    foreach ($item['options'] as $optionPosition => $optionText) {
                        $question->options()->create([
                            'option' => $optionText,
                            'is_correct' => $optionPosition === $item['answer'],
                            'position' => $optionPosition,
                        ]);
                    }
                }
            }
        }
    }
}

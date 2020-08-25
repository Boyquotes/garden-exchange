<?php
namespace App\Utils;

class MomentFormatConverter
{
    /**
     * This defines the mapping between PHP ICU date format (key) and moment.js date format (value)
     * For ICU formats see http://userguide.icu-project.org/formatparse/datetime#TOC-Date-Time-Format-Syntax
     * For Moment formats see https://momentjs.com/docs/#/displaying/format/.
     *
     * @var array
     */
    private static $formatConvertRules = [
        // year
        'yyyy' => 'YYYY', 'yy' => 'YY', 'y' => 'YYYY',
        // day
        'dd' => 'DD', 'd' => 'D',
        // day of week
        'EE' => 'ddd', 'EEEEEE' => 'dd',
        // timezone
        'ZZZZZ' => 'Z', 'ZZZ' => 'ZZ',
        // letter 'T'
        '\'T\'' => 'T',
    ];

    /**
     * Returns associated moment.js format.
     */
    public function convert(string $format): string
    {
        return strtr($format, self::$formatConvertRules);
    }
}

<?php
namespace App\Twig;

use Symfony\Component\Intl\Locales;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use Twig\TwigFilter;
use function Symfony\Component\String\u;

class AppExtension extends AbstractExtension
{


    private $localeCodes;
    private $locales;

    public function __construct(string $locales)
    {
        $localeCodes = explode('|', $locales);
        sort($localeCodes);
        $this->localeCodes = $localeCodes;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions(): array
    {
        return [
            new TwigFunction('locales', [$this, 'getLocales']),
        ];
    }

    public function getFilters()
    {
        return [
            new TwigFilter('truncate', [$this, 'truncate']),
        ];
    }

    /**
     * Takes the list of codes of the locales (languages) enabled in the
     * application and returns an array with the name of each locale written
     * in its own language (e.g. English, Français, Español, etc.).
     */
    public function getLocales(): array
    {
        if (null !== $this->locales) {
            return $this->locales;
        }

        $this->locales = [];
        foreach ($this->localeCodes as $localeCode) {
            $this->locales[] = ['code' => $localeCode, 'name' => Locales::getName($localeCode, $localeCode)];
        }

        return $this->locales;
    }
    
    public function truncate($string, $nbCut, $cutLastWord = true ): string
    {   
        if($string){
            return u($string)->truncate($nbCut, '…', $cutLastWord);
        }
        return '...';
    }


}

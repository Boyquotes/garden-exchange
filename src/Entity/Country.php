<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CountryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=CountryRepository::class)
 */
class Country
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $alpha2;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $alpha3;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $langCS;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $langDE;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $langEN;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $langES;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $langFR;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $langIT;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $langNL;

    /**
     * @ORM\OneToMany(targetEntity=Garden::class, mappedBy="country")
     */
    private $gardens;

    /**
     * @ORM\OneToMany(targetEntity=Profile::class, mappedBy="country")
     */
    private $profiles;

    /**
     * @ORM\OneToMany(targetEntity=Profile::class, mappedBy="country_residence")
     */
    private $resident;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $enabled;
    
    /**
     * @ORM\Column(type="integer", nullable=false, options={"default" : 1000})
     */
    private $orderForm;

    public function __construct()
    {
        $this->gardens = new ArrayCollection();
        $this->profiles = new ArrayCollection();
        $this->resident = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?int
    {
        return $this->code;
    }

    public function setCode(int $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getAlpha2(): ?string
    {
        return $this->alpha2;
    }

    public function setAlpha2(string $alpha2): self
    {
        $this->alpha2 = $alpha2;

        return $this;
    }

    public function getAlpha3(): ?string
    {
        return $this->alpha3;
    }

    public function setAlpha3(string $alpha3): self
    {
        $this->alpha3 = $alpha3;

        return $this;
    }

    public function getLangCS(): ?string
    {
        return $this->langCS;
    }

    public function setLangCS(string $langCS): self
    {
        $this->langCS = $langCS;

        return $this;
    }

    public function getLangDE(): ?string
    {
        return $this->langDE;
    }

    public function setLangDE(string $langDE): self
    {
        $this->langDE = $langDE;

        return $this;
    }

    public function getLangEN(): ?string
    {
        return $this->langEN;
    }

    public function setLangEN(string $langEN): self
    {
        $this->langEN = $langEN;

        return $this;
    }

    public function getLangES(): ?string
    {
        return $this->langES;
    }

    public function setLangES(string $langES): self
    {
        $this->langES = $langES;

        return $this;
    }

    public function getLangFR(): ?string
    {
        return $this->langFR;
    }

    public function setLangFR(string $langFR): self
    {
        $this->langFR = $langFR;

        return $this;
    }

    public function getLangIT(): ?string
    {
        return $this->langIT;
    }

    public function setLangIT(string $langIT): self
    {
        $this->langIT = $langIT;

        return $this;
    }

    public function getLangNL(): ?string
    {
        return $this->langNL;
    }

    public function setLangNL(string $langNL): self
    {
        $this->langNL = $langNL;

        return $this;
    }

    /**
     * @return Collection|Garden[]
     */
    public function getGardens(): Collection
    {
        return $this->gardens;
    }

    public function addGarden(Garden $garden): self
    {
        if (!$this->gardens->contains($garden)) {
            $this->gardens[] = $garden;
            $garden->setCountry($this);
        }

        return $this;
    }

    public function removeGarden(Garden $garden): self
    {
        if ($this->gardens->contains($garden)) {
            $this->gardens->removeElement($garden);
            // set the owning side to null (unless already changed)
            if ($garden->getCountry() === $this) {
                $garden->setCountry(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Profile[]
     */
    public function getProfiles(): Collection
    {
        return $this->profiles;
    }

    public function addProfile(Profile $profile): self
    {
        if (!$this->profiles->contains($profile)) {
            $this->profiles[] = $profile;
            $profile->addCountry($this);
        }

        return $this;
    }

    public function removeProfile(Profile $profile): self
    {
        if ($this->profiles->contains($profile)) {
            $this->profiles->removeElement($profile);
            $profile->removeCountry($this);
        }

        return $this;
    }

    /**
     * @return Collection|Profile[]
     */
    public function getResident(): Collection
    {
        return $this->resident;
    }

    public function addResident(Profile $resident): self
    {
        if (!$this->resident->contains($resident)) {
            $this->resident[] = $resident;
            $resident->addCountryResidence($this);
        }

        return $this;
    }

    public function removeResident(Profile $resident): self
    {
        if ($this->resident->contains($resident)) {
            $this->resident->removeElement($resident);
            $resident->removeCountryResidence($this);
        }

        return $this;
    }

    public function getEnabled(): ?bool
    {
        return $this->enabled;
    }

    public function setEnabled(?bool $enabled): self
    {
        $this->enabled = $enabled;

        return $this;
    }

    public function getOrderForm(): ?int
    {
        return $this->orderForm;
    }

    public function setOrderForm(int $orderForm): self
    {
        $this->orderForm = $orderForm;

        return $this;
    }

}

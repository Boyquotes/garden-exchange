<?php

namespace App\Entity;

use App\Repository\ProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProfileRepository::class)
 * @ORM\HasLifecycleCallbacks
 */
class Profile
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $street;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $postcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $telephone;

    /**
     * @ORM\ManyToOne(targetEntity=Country::class, inversedBy="profiles")
     * @ORM\JoinColumn(nullable=true)
     */
    private $country;
    
    /**
     * @ORM\ManyToOne(targetEntity=Country::class, inversedBy="resident")
     * @ORM\JoinColumn(nullable=true)
     */
    private $country_residence;

    /**
     * @ORM\OneToOne(targetEntity=User::class, inversedBy="profile", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $profileImage;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @var datetime $created
     *
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @var datetime $updated
     * 
     * @ORM\Column(type="datetime", nullable = true)
     */
    protected $updated;
    
    /**
     * @ORM\Column(type="boolean", nullable = true)
     */
    private $agreeTerms;
    
    /**
     * @var datetime $agreeTermsCreated
     *
     * @ORM\Column(type="datetime")
     */
    protected $agreeTermsCreated;

    /**
     * @var datetime $agreeTermsUpdated
     * 
     * @ORM\Column(type="datetime", nullable = true)
     */
    protected $agreeTermsUpdated;

    /**
     * @ORM\ManyToMany(targetEntity=CampingType::class, inversedBy="profiles")
     */
    private $campingTypes;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $langs = [];

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $emailVerified;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $phoneVerified;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $identityVerified;

    public function __construct()
    {
        $this->campingTypes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(?string $street): self
    {
        $this->street = $street;

        return $this;
    }

    public function getPostcode(): ?int
    {
        return $this->postcode;
    }

    public function setPostcode(?int $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getTelephone()
    {
        return $this->telephone;
    }

    public function setTelephone($telephone): self
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getCountryResidence(): ?Country
    {
        return $this->country_residence;
    }

    public function setCountryResidence(?Country $country_residence): self
    {
        $this->country_residence = $country_residence;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }
    
    public function getProfileImage(): ?string
    {
        return $this->profileImage;
    }

    public function setProfileImage(string $profileImage): self
    {
        $this->profileImage = $profileImage;

        return $this;
    }
    
    public function getEmailVerified(): ?string
    {
        return $this->emailVerified;
    }

    public function setEmailVerified(string $emailVerified): self
    {
        $this->emailVerified = $emailVerified;

        return $this;
    }
    
    public function getPhoneVerified(): ?string
    {
        return $this->phoneVerified;
    }

    public function setPhoneVerified(string $phoneVerified): self
    {
        $this->phoneVerified = $phoneVerified;

        return $this;
    }

    public function getIdentityVerified(): ?string
    {
        return $this->identityVerified;
    }

    public function setIdentityVerified(string $identityVerified): self
    {
        $this->identityVerified = $identityVerified;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getCreated(): \DateTime
    {
        return $this->created;
    }

    public function getUpdated()
    {
        return $this->updated;
    }

    public function setUpdated(\DateTime $updated): void
    {
        $this->updated = $updated;
    }
    
    public function getAgreeTermsCreated()
    {
        return $this->agreeTermsCreated;
    }

    public function getAgreeTerms(): ?bool
    {
        return $this->agreeTerms;
    }

    public function setAgreeTerms(bool $agreeTerms): self
    {
        $this->agreeTerms = $agreeTerms;
        return $this;
    }

    public function setAgreeTermsCreated(\DateTime $agreeTermsCreated): void
    {
        $this->agreeTermsCreated = $agreeTermsCreated;
    }
    
    public function getAgreeTermsUpdated()
    {
        return $this->agreeTermsUpdated;
    }

    public function setAgreeTermsUpdated(\DateTime $agreeTermsUpdated): void
    {
        $this->agreeTermsUpdated = $agreeTermsUpdated;
    }

    /**
     * @return Collection|CampingType[]
     */
    public function getCampingTypes(): Collection
    {
        return $this->campingTypes;
    }

    public function addCampingType(CampingType $campingType): self
    {
        if (!$this->campingTypes->contains($campingType)) {
            $this->campingTypes[] = $campingType;
        }

        return $this;
    }

    public function removeCampingType(CampingType $campingType): self
    {
        if ($this->campingTypes->contains($campingType)) {
            $this->campingTypes->removeElement($campingType);
        }

        return $this;
    }

    public function getLangs(): ?array
    {
        return $this->langs;
    }

    public function setLangs(?array $langs): self
    {
        $this->langs = $langs;

        return $this;
    }

    public function getNumberByStatusNight($profilNights, $status){
        $nightAvailable = 0;
        foreach($profilNights as $profilNight){
            dump($profilNight->getStatus());
            if($profilNight->getStatus() == $status){
                $nightAvailable++;
            }
        }
        return $nightAvailable;
    }
    

    public function getNumberTypeNight($profilNights, $type){
        $nightAvailable = 0;
        foreach($profilNights as $profilNight){
            dump($profilNight->getStatus());
            if($profilNight->getStatus() == $type){
                $nightAvailable++;
            }
        }
        return $nightAvailable;
    }
    /**
     * Gets triggered only on insert
     * @ORM\PrePersist
     */
    public function onPrePersist()
    {
        $this->created = new \DateTime("now");
    }
    
    /**
     * Gets triggered every time on update
     * @ORM\PreUpdate
     */
    public function onPreUpdate()
    {
        $this->updated = new \DateTime("now");
    }
    
}

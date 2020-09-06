<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\GardenRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *     collectionOperations={"get"},
 *     itemOperations={"get"}
 * )
 * @ORM\Entity(repositoryClass=GardenRepository::class)
 * @ORM\HasLifecycleCallbacks
 */
class Garden
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $street;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $postcode;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $city;

    /**
     * @ORM\Column(type="float", nullable = true)
     */
    private $lat;

    /**
     * @ORM\Column(type="float", nullable = true)
     */
    private $lng;

    /**
     * @ORM\Column(type="float", nullable = true)
     */
    private $latCity;

    /**
     * @ORM\Column(type="float", nullable = true)
     */
    private $lngCity;

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
     * @var datetime $publishedAt
     * 
     * @ORM\Column(type="datetime", nullable = true)
     */
    protected $publishedAt;

    /**
     * @ORM\Column(type="boolean", nullable = true)
     */
    private $enabled;
    
    /**
     * @ORM\Column(type="boolean", nullable = true)
     */
    private $expired;
    
    /**
     * @ORM\Column(type="boolean", nullable = true)
     */
    private $locked;

    /**
     * @ORM\ManyToMany(targetEntity=Equipment::class, inversedBy="gardens", cascade={"persist"}, fetch="EAGER")
     */
    private $equipments;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="gardens")
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity=GardenImage::class, mappedBy="garden", orphanRemoval=true, cascade={"persist"}, fetch="EAGER")
     */
    private $gardenImages;

    /**
     * @ORM\ManyToOne(targetEntity=Country::class, inversedBy="gardens")
     * @ORM\JoinColumn(nullable=false)
     */
    private $country;

    /**
     * @ORM\ManyToMany(targetEntity=CampingType::class, inversedBy="gardens", cascade={"persist"})
     */
    private $campingTypes;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $area;

    /**
     * @ORM\OneToMany(targetEntity=ConversationExchange::class, mappedBy="garden", orphanRemoval=true)
     */
    private $conversationExchanges;

    /**
     * @ORM\ManyToMany(targetEntity=Rule::class, inversedBy="gardens")
     */
    private $rules;

    public function __construct()
    {
        $this->campingTypes = new ArrayCollection();
        $this->equipments = new ArrayCollection();
        $this->gardenImages = new ArrayCollection();
        $this->rules = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(string $street): self
    {
        $this->street = $street;

        return $this;
    }

    public function getPostcode(): ?string
    {
        return $this->postcode;
    }

    public function setPostcode(string $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getLat(): ?float
    {
        return $this->lat;
    }

    public function setLat(float $lat): self
    {
        $this->lat = $lat;

        return $this;
    }

    public function getLng(): ?float
    {
        return $this->lng;
    }

    public function setLng(float $lng): self
    {
        $this->lng = $lng;

        return $this;
    }
    
    public function getLatCity(): ?float
    {
        return $this->latCity;
    }

    public function setLatCity(float $latCity): self
    {
        $this->latCity = $latCity;

        return $this;
    }
    
    public function getLngCity(): ?float
    {
        return $this->lngCity;
    }

    public function setLngCity(float $lngCity): self
    {
        $this->lngCity = $lngCity;

        return $this;
    }
    
    public function getPublishedAt()
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(\DateTime $publishedAt): void
    {
        $this->publishedAt = $publishedAt;
    }
    
    public function getCreated(): \DateTime
    {
        return $this->created;
    }

    public function getUpdated(): \DateTime
    {
        return $this->updated;
    }

    public function setUpdated(\DateTime $updated): void
    {
        $this->updated = $updated;
    }
    
    public function getEnabled(): ?bool
    {
        return $this->enabled;
    }

    public function setEnabled(bool $enabled): self
    {
        $this->enabled = $enabled;
        return $this;
    }
    
    public function getExpired(): ?bool
    {
        return $this->expired;
    }

    public function setExpired(bool $expired): self
    {
        $this->expired = $expired;
        return $this;
    }
    
    public function getLocked(): ?bool
    {
        return $this->locked;
    }

    public function setLocked(bool $locked): self
    {
        $this->locked = $locked;
        return $this;
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

    /**
     * @return Collection|Equipments[]
     */
    public function getEquipments(): Collection
    {
        return $this->equipments;
    }

    public function addEquipment(Equipment $equipment): self
    {
        if (!$this->equipments->contains($equipment)) {
            $this->equipments[] = $equipment;
        }

        return $this;
    }

    public function removeEquipment(Equipment $equipment): self
    {
        if ($this->equipments->contains($equipment)) {
            $this->equipments->removeElement($equipment);
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection|GardenImage[]
     */
    public function getGardenImages(): Collection
    {
        return $this->gardenImages;
    }

    public function addGardenImage(GardenImage $gardenImage): self
    {
        if (!$this->gardenImages->contains($gardenImage)) {
            $this->gardenImages[] = $gardenImage;
            $gardenImage->setGarden($this);
        }

        return $this;
    }

    public function removeGardenImage(GardenImage $gardenImage): self
    {
        if ($this->gardenImages->contains($gardenImage)) {
            $this->gardenImages->removeElement($gardenImage);
            // set the owning side to null (unless already changed)
            if ($gardenImage->getGarden() === $this) {
                $gardenImage->setGarden(null);
            }
        }

        return $this;
    }

    public function getCountry(): ?Country
    {
        return $this->country;
    }

    public function setCountry(?Country $country): self
    {
        $this->country = $country;

        return $this;
    }
    
    /**
     * @return Collection|CampingTypes[]
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

    public function getArea(): ?string
    {
        return $this->area;
    }

    public function setArea(string $area): self
    {
        $this->area = $area;

        return $this;
    }

    /**
     * @return Collection|Rule[]
     */
    public function getRules(): Collection
    {
        return $this->rules;
    }

    public function addRule(Rule $rule): self
    {
        if (!$this->rules->contains($rule)) {
            $this->rules[] = $rule;
        }

        return $this;
    }

    public function removeRule(Rule $rule): self
    {
        if ($this->rules->contains($rule)) {
            $this->rules->removeElement($rule);
        }

        return $this;
    }
    
}

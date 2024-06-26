<?php
namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="user")
 * @ORM\HasLifecycleCallbacks
 * @UniqueEntity(fields={"email"}, message="There is already an account with this email")
 */
class User implements UserInterface, \Serializable
{
    /**
     * @var int
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable = true)
     */
    private $fullName;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     * @Assert\NotBlank()
     */
    private $firstName;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     * @Assert\NotBlank()
     */
    private $lastName;

    /**
     * @var string
     *
     * @ORM\Column(type="string", unique=true, nullable = true)
     */
    private $username;

    /**
     * @var string
     *
     * @ORM\Column(type="string", unique=true)
     * @Assert\Email()
     */
    private $email;

    /**
     * @var string
     *
     * @ORM\Column(type="string")
     * @Assert\Length(
     *     min=6,
     *     minMessage="password.too_short",
     *     max=4096,
     *     maxMessage="password.too_long"
     * )
     */
    private $password;

    /**
     * @var array
     *
     * @ORM\Column(type="json")
     */
    private $roles = [];

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
     * @ORM\OneToMany(targetEntity=Garden::class, mappedBy="user", orphanRemoval=true, fetch="EAGER")
     */
    private $gardens;

    /**
     * @ORM\OneToOne(targetEntity=Profile::class, mappedBy="user", cascade={"persist", "remove"})
     */
    private $profile;

    /**
     * @ORM\OneToMany(targetEntity=MessageExchange::class, mappedBy="user", cascade={"remove"})
     */
    private $messageExchanges;

    /**
     * @ORM\OneToMany(targetEntity=ConversationExchange::class, mappedBy="host", fetch="EAGER", cascade={"remove"})
     */
    private $conversationExchanges;

    /**
     * @ORM\OneToMany(targetEntity=ConversationExchange::class, mappedBy="camper", cascade={"remove"})
     */
    private $conversationCamperBivouacs;

    /**
     * @ORM\OneToMany(targetEntity=ResetPasswordRequest::class, mappedBy="user", orphanRemoval=true, cascade={"remove"}, fetch="EAGER")
     */
    private $requestPasswordRequest;
    
    /**
     * @ORM\OneToMany(targetEntity=Comment::class, mappedBy="author", cascade={"remove"})
     */
    private $comments;
    
    /**
     * @ORM\OneToMany(targetEntity=Post::class, mappedBy="author", cascade={"remove"})
     */
    private $posts;

    /**
     * @ORM\OneToMany(targetEntity=ProfilNight::class, mappedBy="user", fetch="EAGER")
     */
    private $profilNights;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isVerified = false;

    public function __construct()
    {
        $this->gardens = new ArrayCollection();
        $this->messageExchanges = new ArrayCollection();
        $this->conversationExchanges = new ArrayCollection();
        $this->conversationCamperBivouacs = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->profilNights = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setFullName(string $fullName): void
    {
        $this->fullName = $fullName;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): void
    {
        $this->firstName = $firstName;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }
    
    public function setLastName(string $lastName): void
    {
        $this->lastName = $lastName;
    }

    public function getFullName(): ?string
    {
        return $this->fullName;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): void
    {
        $this->username = $username;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    /**
     * Returns the roles or permissions granted to the user for security.
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        // guarantees that a user always has at least one role for security
        if (empty($roles)) {
            $roles[] = 'ROLE_USER';
        }

        return array_unique($roles);
    }

    public function setRoles(array $roles): void
    {
        $this->roles = $roles;
    }

    /**
     * Returns the salt that was originally used to encode the password.
     *
     * {@inheritdoc}
     */
    public function getSalt(): ?string
    {
        // We're using bcrypt in security.yaml to encode the password, so
        // the salt value is built-in and and you don't have to generate one
        // See https://en.wikipedia.org/wiki/Bcrypt

        return null;
    }

    /**
     * Removes sensitive data from the user.
     *
     * {@inheritdoc}
     */
    public function eraseCredentials(): void
    {
        // if you had a plainPassword property, you'd nullify it here
        // $this->plainPassword = null;
    }

    /**
     * {@inheritdoc}
     */
    public function serialize(): string
    {
        // add $this->salt too if you don't use Bcrypt or Argon2i
        return serialize([$this->id, $this->username, $this->password]);
    }

    /**
     * {@inheritdoc}
     */
    public function unserialize($serialized): void
    {
        // add $this->salt too if you don't use Bcrypt or Argon2i
        [$this->id, $this->username, $this->password] = unserialize($serialized, ['allowed_classes' => false]);
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
            $garden->setUser($this);
        }

        return $this;
    }

    public function removeGarden(Garden $garden): self
    {
        if ($this->gardens->contains($garden)) {
            $this->gardens->removeElement($garden);
            // set the owning side to null (unless already changed)
            if ($garden->getUser() === $this) {
                $garden->setUser(null);
            }
        }

        return $this;
    }

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(Profile $profile): self
    {
        $this->profile = $profile;

        // set the owning side of the relation if necessary
        if ($profile->getUser() !== $this) {
            $profile->setUser($this);
        }

        return $this;
    }

    /**
     * @return Collection|MessageExchange[]
     */
    public function getMessageExchanges(): Collection
    {
        return $this->messageExchanges;
    }

    public function addMessageExchange(MessageExchange $messageExchange): self
    {
        if (!$this->messageExchanges->contains($messageExchange)) {
            $this->messageExchanges[] = $messageExchange;
            $messageExchange->setUser($this);
        }

        return $this;
    }

    public function removeMessageExchange(MessageExchange $messageExchange): self
    {
        if ($this->messageExchanges->contains($messageExchange)) {
            $this->messageExchanges->removeElement($messageExchange);
            // set the owning side to null (unless already changed)
            if ($messageExchange->getUser() === $this) {
                $messageExchange->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ConversationExchange[]
     */
    public function getConversationExchanges(): Collection
    {
        return $this->conversationExchanges;
    }

    public function addConversationExchange(ConversationExchange $conversationExchange): self
    {
        if (!$this->conversationExchanges->contains($conversationExchange)) {
            $this->conversationExchanges[] = $conversationExchange;
            $conversationExchange->setHost($this);
        }

        return $this;
    }

    public function removeConversationExchange(ConversationExchange $conversationExchange): self
    {
        if ($this->conversationExchanges->contains($conversationExchange)) {
            $this->conversationExchanges->removeElement($conversationExchange);
            // set the owning side to null (unless already changed)
            if ($conversationExchange->getHost() === $this) {
                $conversationExchange->setHost(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ConversationExchange[]
     */
    public function getConversationCamperBivouacs(): Collection
    {
        return $this->conversationCamperBivouacs;
    }

    public function addConversationCamperBivouac(ConversationExchange $conversationCamperBivouac): self
    {
        if (!$this->conversationCamperBivouacs->contains($conversationCamperBivouac)) {
            $this->conversationCamperBivouacs[] = $conversationCamperBivouac;
            $conversationCamperBivouac->setCamper($this);
        }

        return $this;
    }

    public function removeConversationCamperBivouac(ConversationExchange $conversationCamperBivouac): self
    {
        if ($this->conversationCamperBivouacs->contains($conversationCamperBivouac)) {
            $this->conversationCamperBivouacs->removeElement($conversationCamperBivouac);
            // set the owning side to null (unless already changed)
            if ($conversationCamperBivouac->getCamper() === $this) {
                $conversationCamperBivouac->setCamper(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ProfilNight[]
     */
    public function getProfilNights(): Collection
    {
        return $this->profilNights;
    }

    public function addProfilNights(ProfilNight $profilNights): self
    {
        if (!$this->profilNights->contains($profilNights)) {
            $this->profilNights[] = $profilNights;
            $profilNights->setUser($this);
        }

        return $this;
    }

    public function removeProfilNights(ProfilNight $profilNights): self
    {
        if ($this->profilNights->contains($profilNights)) {
            $this->profilNights->removeElement($profilNights);
            // set the owning side to null (unless already changed)
            if ($profilNights->getUser() === $this) {
                $profilNights->setUser(null);
            }
        }

        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): self
    {
        $this->isVerified = $isVerified;

        return $this;
    }
    
}

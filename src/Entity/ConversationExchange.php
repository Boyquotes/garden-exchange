<?php

namespace App\Entity;

use App\Repository\ConversationExchangeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity(repositoryClass=ConversationExchangeRepository::class)
 * @ORM\HasLifecycleCallbacks
 */
class ConversationExchange
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
    private $content;

    /**
     * @var datetime $created
     *
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @ORM\ManyToOne(targetEntity=Garden::class, inversedBy="conversationExchanges")
     * @ORM\JoinColumn(nullable=true)
     */
    private $garden;

    /**
     * @ORM\OneToMany(targetEntity=MessageExchange::class, mappedBy="conversationExchange", orphanRemoval=true)
     */
    private $messagesExchange;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="conversationExchanges")
     */
    private $host;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="conversationCamperExchanges")
     * @ORM\JoinColumn(nullable=true)
     */
    private $camper;

    public function __construct()
    {
        $this->messagesExchange = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getCreated(): \DateTime
    {
        return $this->created;
    }

    /**
     * @return Collection|MessageExchange[]
     */
    public function getMessageExchanges(): Collection
    {
        return $this->messagesExchange;
    }

    public function addMessageExchange(MessageExchange $messageExchange): self
    {
        if (!$this->messagesExchange->contains($messageExchange)) {
            $this->messagesExchange[] = $messageExchange;
            $messageExchange->setConversationExchange($this);
        }

        return $this;
    }

    public function removeMessageExchange(MessageExchange $messageExchange): self
    {
        if ($this->messagesExchange->contains($messageExchange)) {
            $this->messagesExchange->removeElement($messageExchange);
            // set the owning side to null (unless already changed)
            if ($messageExchange->getConversationExchange() === $this) {
                $messageExchange->setConversationExchange(null);
            }
        }

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

    public function getHost(): ?User
    {
        return $this->host;
    }

    public function setHost(?User $host): self
    {
        $this->host = $host;

        return $this;
    }

    public function getCamper(): ?User
    {
        return $this->camper;
    }

    public function setCamper(?User $camper): self
    {
        $this->camper = $camper;

        return $this;
    }
    
    public function getGarden(): ?Garden
    {
        return $this->garden;
    }

    public function setGarden(?Garden $garden): self
    {
        $this->garden = $garden;

        return $this;
    }
    
}
